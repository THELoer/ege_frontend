import { api } from "./client";

export interface AuthResponse {
  token: string;
  role: "student" | "admin";
  user: {
    email: string;
    name?: string;
  };
}

export const login = (email: string, password: string) =>
  api.post<AuthResponse>("/auth/login", { email, password });

export const register = (payload: {
  email: string;
  password: string;
  name: string;
}) => api.post<AuthResponse>("/auth/register", payload);

export const getProfile = () => api.get<AuthResponse["user"]>("/auth/me");
