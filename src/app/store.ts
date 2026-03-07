import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: "student" | "admin" | null;
  setAuth: (token: string, role: "student" | "admin") => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  role: null,
  setAuth: (token, role) => set({ token, role }),
  logout: () => set({ token: null, role: null }),
}));
