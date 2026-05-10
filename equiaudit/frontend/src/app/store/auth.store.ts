// Auth store logic
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;

  setAuth: (token: string, user: User) => void;

  logout: () => void;

  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },

  restoreSession: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
      });
    }
  },
}));