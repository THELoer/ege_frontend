import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../app/store";

export default function ProtectedRoute({
  children,
  admin = false,
}: {
  children: ReactElement;
  admin?: boolean;
}) {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && role !== "admin") return <Navigate to="/" replace />;

  return children;
}
