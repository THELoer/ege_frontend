import { Navigate } from "react-router-dom";
import { useAuth } from "../app/store";

export default function ProtectedRoute({
  children,
  admin = false,
}: {
  children: JSX.Element;
  admin?: boolean;
}) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (admin && role !== "admin") return <Navigate to="/" />;

  return children;
}
