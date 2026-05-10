// Auth store logic
import { create } from "zustand";

import { STORAGE_KEYS } from "../../constants/storage";
import { tokenService } from "../../services/auth/token.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;

  setAuth: (
    token: string,
    user: User,
    rememberSession?: boolean
  ) => void;

  logout: () => void;

  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setAuth: (
    token,
    user,
    rememberSession = true
  ) => {
    tokenService.setAccessToken(token);
    if (rememberSession) {
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
      );
      sessionStorage.removeItem(
        STORAGE_KEYS.USER
      );
    } else {
      sessionStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
      );
      localStorage.removeItem(
        STORAGE_KEYS.USER
      );
    }

    set({
      token,
      user,
    });
  },

  logout: () => {
    tokenService.clearTokens();
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },

  restoreSession: () => {
    const legacyToken = localStorage.getItem("token");
    const legacyUser = localStorage.getItem("user");

    let token = tokenService.getAccessToken();
    let user = localStorage.getItem(
      STORAGE_KEYS.USER
    );
    if (!user) {
      user = sessionStorage.getItem(
        STORAGE_KEYS.USER
      );
    }

    if (!token && legacyToken) {
      tokenService.setAccessToken(legacyToken);
      localStorage.removeItem("token");
      token = legacyToken;
    }

    if (!user && legacyUser) {
      localStorage.setItem(STORAGE_KEYS.USER, legacyUser);
      localStorage.removeItem("user");
      user = legacyUser;
    }

    if (token) {
      set({
        token,
        user: user ? JSON.parse(user) : null,
      });
    }
  },
}));
