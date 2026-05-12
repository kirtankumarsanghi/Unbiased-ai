import { ReactNode, useEffect } from "react";

import { useAuthStore } from "../store/auth.store";
import { authService } from "../../services/auth/auth.service";
import { isMockEnabled } from "../../services/api/mock";
import { useUIStore } from "../store/ui.store";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setBackendReady = useUIStore((state) => state.setBackendReady);

  useEffect(() => {
    const restore = async () => {
      setLoading(true);
      try {
        if (isMockEnabled()) {
          // In mock mode, just restore session from localStorage
          setBackendReady(true);
          try {
            const me = await authService.me();
            setAuthUser({
              id: String(me.id),
              name: me.name,
              email: me.email,
              role: me.role,
            });
          } catch {
            // No saved session, user needs to login
            setAuthUser(null);
          }
        } else {
          // Real backend mode
          try {
            const { default: axios } = await import("axios");
            const { authApi } = await import("../../services/api/auth.api");
            await authApi.status();
            setBackendReady(true);
            await authService.ensureCsrf();
            const me = await authService.me();
            setAuthUser({
              id: String(me.id),
              name: me.name,
              email: me.email,
              role: me.role,
            });
          } catch (error) {
            const axios = (await import("axios")).default;
            if (axios.isAxiosError(error) && !error.response) {
              setBackendReady(false);
              setAuthUser(null);
              return;
            }
            try {
              await authService.refresh();
              setBackendReady(true);
              const me = await authService.me();
              setAuthUser({
                id: String(me.id),
                name: me.name,
                email: me.email,
                role: me.role,
              });
            } catch {
              setAuthUser(null);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, [setAuthUser, setBackendReady, setLoading]);

  return <>{children}</>;
}
