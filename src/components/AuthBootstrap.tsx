import { useEffect, useRef } from "react";
import { getProfile } from "../api/auth";
import { useAuth } from "../app/store";

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const token = useAuth((s) => s.token);
  const logout = useAuth((s) => s.logout);
  const setProfile = useAuth((s) => s.setProfile);
  const lastCheckedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!token) {
      lastCheckedToken.current = null;
      return;
    }

    if (lastCheckedToken.current === token) {
      return;
    }

    lastCheckedToken.current = token;

    getProfile()
      .then((response) => {
        setProfile({
          email: response.data.email,
          name: response.data.name,
        });
      })
      .catch(() => {
        lastCheckedToken.current = null;
        logout();
      });
  }, [logout, setProfile, token]);

  return <>{children}</>;
}
