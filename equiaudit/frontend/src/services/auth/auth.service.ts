// Auth service logic
import { authApi } from "../api/auth.api";
import { isMockEnabled } from "../api/mock";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const MOCK_USER_KEY = "equiaudit_mock_user";

const buildMockUser = (email: string, name?: string): AuthUser => {
  const safeName =
    name?.trim() ||
    email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Analyst";
  return {
    id: `mock-${email}`,
    name: safeName,
    email,
    role: "ANALYST",
  };
};

const readMockUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const writeMockUser = (user: AuthUser) => {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
};

const clearMockUser = () => {
  localStorage.removeItem(MOCK_USER_KEY);
};

export const authService = {
  ensureCsrf: async () => (isMockEnabled() ? { csrf_token: "mock" } : authApi.csrf()),

  signup: async (
    name: string,
    email: string,
    password: string,
    organisation_name?: string
  ) => {
    if (isMockEnabled()) {
      const user = buildMockUser(email, name);
      writeMockUser(user);
      return { user };
    }
    return authApi.signup({ name, email, password, organisation_name });
  },

  login: async (
    email: string,
    password: string,
    remember_me = true
  ) => {
    if (isMockEnabled()) {
      const user = buildMockUser(email);
      writeMockUser(user);
      return { user };
    }
    return authApi.login({ email, password, remember_me });
  },

  me: async () => {
    if (isMockEnabled()) {
      const user = readMockUser();
      if (!user) {
        throw new Error("No mock session");
      }
      return user;
    }
    return authApi.me();
  },

  refresh: async () => {
    if (isMockEnabled()) {
      const user = readMockUser();
      if (!user) {
        throw new Error("No mock session");
      }
      return { user };
    }
    return authApi.refresh();
  },

  logout: async () => {
    if (isMockEnabled()) {
      clearMockUser();
      return;
    }
    await authApi.logout();
  },

  forgotPassword: async (email: string) => {
    if (isMockEnabled()) {
      const user = buildMockUser(email);
      writeMockUser(user);
      return { message: "Reset request submitted." };
    }
    return authApi.forgotPassword(email);
  },

  resetPassword: async (token: string, newPassword: string) => {
    if (isMockEnabled()) {
      return { message: "Password updated." };
    }
    return authApi.resetPassword(token, newPassword);
  },
};
