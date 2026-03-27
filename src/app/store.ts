import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  role: "student" | "admin" | null;
  email: string | null;
  name: string | null;
  setAuth: (payload: {
    token: string;
    role: "student" | "admin";
    email: string;
    name?: string;
  }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      email: null,
      name: null,
      setAuth: ({ token, role, email, name }) =>
        set({ token, role, email, name: name ?? null }),
      logout: () =>
        set({ token: null, role: null, email: null, name: null }),
    }),
    {
      name: "ege-auth",
    }
  )
);
