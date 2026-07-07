import {
  useState,
  useCallback,
  useRef,
  type ReactNode,
  useEffect,
} from "react";
import { storage } from "@/lib/storage";
import { type User } from "@/types";

import { configureAuthInterceptor } from "@/api/authInterceptor";
import { refresh } from "@/services/auth.service";

import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tokenRef = useRef<string | null>(null);

  const setAuth = useCallback((token: string, userData: User) => {
    tokenRef.current = token;
    setAccessToken(token);
    setUser(userData);
    storage.setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    tokenRef.current = null;
    setAccessToken(null);
    setUser(null);
    storage.clearUser();
  }, []);

  useEffect(() => {
    configureAuthInterceptor({
      getAccessToken: () => tokenRef.current,
      onRefreshed: (token) => {
        tokenRef.current = token;
        setAccessToken(token);
      },
      onAuthFailed: clearAuth,
    });
  }, [clearAuth]);

  useEffect(() => {
    async function bootstrap() {
      const storedUser = storage.getUser();
      if (!storedUser) {
        setIsLoading(false);
        return;
      }
      const result = await refresh();
      if (result) setAuth(result.token, storedUser);
      else clearAuth();
      setIsLoading(false);
      console.log("bootstrap ran");
    }
    bootstrap();
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, user, isLoading, setAuth, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
