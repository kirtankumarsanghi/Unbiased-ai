// useAuth hook
import { useAuthStore } from "../app/store/auth.store";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    clearAuth,
    setAuthUser,
  } = useAuthStore();

  return {
    isAuthenticated,

    user,

    setAuthUser,

    logout: clearAuth,
  };
}
