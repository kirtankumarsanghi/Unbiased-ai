// useAuth hook
import { useAuthStore } from "../app/store/auth.store";

export function useAuth() {
  const {
    token,
    user,
    setAuth,
    logout,
  } = useAuthStore();

  return {
    isAuthenticated: !!token,

    token,

    user,

    setAuth,

    logout,
  };
}