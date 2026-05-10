import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const token = useAuthStore((state) => state.token);

  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
