import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import { canAccessRoute } from "../../utils/rbac";

interface Props {
  children: ReactNode;
  route: string;
}

export default function RBACRoute({
  children,
  route,
}: Props) {
  const role = useAuthStore(
    (state) => state.user?.role
  );

  if (!canAccessRoute(role, route)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
