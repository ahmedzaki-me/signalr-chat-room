import { api } from "@/api/axios";
import axios from "axios";
import { type AuthResponse } from "@/types";

export const register = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/api/v1/auth/register", {
    email,
    password,
  });
  return data;
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/api/v1/auth/login", {
    email,
    password,
  });
  return data;
};

export const refresh = async () => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return data;
  } catch {
    return null;
  }
};

export const logout = async () => {
  const { data } = await api.post("/api/v1/auth/logout");
  return data;
};
