import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import LoadingScreen from "../../components/common/LoadingScreen";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
