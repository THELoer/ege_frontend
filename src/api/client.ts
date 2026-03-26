import axios from "axios";
import { useAuth } from "../app/store";

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const normalizedApiUrl = rawApiUrl?.replace(/\/$/, "");

export const api = axios.create({
  baseURL: normalizedApiUrl || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
