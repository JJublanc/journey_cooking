import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  const { pathname } = useLocation();

  if (pathname === "/home") return <>{children}</>;
  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
}
