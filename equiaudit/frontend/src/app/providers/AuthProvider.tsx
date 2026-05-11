import { ReactNode, useEffect } from "react";

import { useAuthStore } from "../store/auth.store";
import { authService } from "../../services/auth/auth.service";
import { authApi } from "../../services/api/auth.api";
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
      } catch {
        setBackendReady(false);
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
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, [setAuthUser, setLoading]);

  return <>{children}</>;
}
