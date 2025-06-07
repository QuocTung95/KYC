import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@hooks/useAppSelector";
import { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, initialized } = useAppSelector((state) => state.user);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!user && initialized && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/"} replace />;
  }
  return <>{children}</>;
};
