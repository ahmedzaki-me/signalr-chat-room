import axios from "axios";
import { api } from "./axios";

// Decouples authentication state management (e.g., React state/Zustand) from the Axios instance
type AuthHooks = {
  getAccessToken: () => string | null;
  onRefreshed: (token: string) => void;
  onAuthFailed: () => void;
};

// Fallback implementation to prevent runtime exceptions before configuration injection
let hooks: AuthHooks = {
  getAccessToken: () => null,
  onRefreshed: () => {},
  onAuthFailed: () => {},
};

// Dynamically registers stateful application hooks into the standalone Axios utility
export function configureAuthInterceptor(opts: AuthHooks) {
  hooks = opts;
}

// Request Interceptor: Inject Authorization header before sending the request
api.interceptors.request.use((config) => {
  const token = hooks.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Concurrency state to mitigate race conditions from multiple simultaneous 401 failures
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

// Flushes the queue by either executing waiting requests with the new token or rejecting them all on failure
function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

// Response Interceptor: Catches 401 responses to automatically rotate expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Fail early if the error is not a 401, or if this request already went through a retry attempt
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If token rotation is already in progress, defer this request to the queue instead of duplicating the refresh call
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    // Acquire the lock and flag the original request to prevent infinite loops on subsequent 401s
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Use the raw/clean axios instance to bypass this interceptor chain and avoid cyclic loops
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }, // Essential for transmitting secure HttpOnly refresh cookies
      );

      // Notify UI/State management of the new token and unblock the deferred requests queue
      hooks.onRefreshed(data.token);
      processQueue(null, data.token);

      // Retry the current failed request with the fresh token
      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Critical failure (e.g., expired refresh token). Reject all queued requests and trigger session eviction
      processQueue(refreshError, null);
      hooks.onAuthFailed();
      return Promise.reject(refreshError);
    } finally {
      // Always release the lock to keep the system open for future token expiration cycles
      isRefreshing = false;
    }
  },
);
