import { ReactNode, useEffect } from "react";

import { useAuthStore } from "../store/auth.store";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const restoreSession = useAuthStore(
    (state) => state.restoreSession
  );

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
}
