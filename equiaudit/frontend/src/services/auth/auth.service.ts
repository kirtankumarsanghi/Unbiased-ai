// Auth service logic
import { authApi } from "../api/auth.api";
import { isMockEnabled } from "../api/mock";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type StoredUser = AuthUser & { passwordHash: string };

const MOCK_USER_KEY = "equiaudit_mock_user";
const MOCK_USERS_DB_KEY = "equiaudit_mock_users_db";

/* ---------- helpers ---------- */

const simpleHash = (pw: string): string => {
  // Simple deterministic hash for mock storage (NOT for production)
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    const char = pw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `mock_hash_${Math.abs(hash).toString(36)}`;
};

const getUsersDB = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(MOCK_USERS_DB_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const saveUsersDB = (users: StoredUser[]) => {
  localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};

const findUserByEmail = (email: string): StoredUser | undefined => {
  return getUsersDB().find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const setCurrentUser = (user: AuthUser) => {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
};

const getCurrentUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const clearCurrentUser = () => {
  localStorage.removeItem(MOCK_USER_KEY);
};

const toAuthUser = (stored: StoredUser): AuthUser => ({
  id: stored.id,
  name: stored.name,
  email: stored.email,
  role: stored.role,
});

/* ---------- seed default admin ---------- */

const ensureDefaultUsers = () => {
  const db = getUsersDB();
  if (db.length === 0) {
    const defaults: StoredUser[] = [
      {
        id: "1",
        name: "Platform Admin",
        email: "admin@equiaudit.ai",
        passwordHash: simpleHash("Admin@123"),
        role: "SUPER_ADMIN",
      },
      {
        id: "2",
        name: "Fairness Analyst",
        email: "analyst@equiaudit.ai",
        passwordHash: simpleHash("Analyst@123"),
        role: "ANALYST",
      },
    ];
    saveUsersDB(defaults);
  }
};
ensureDefaultUsers();

/* ---------- public API ---------- */

export const authService = {
  ensureCsrf: async () =>
    isMockEnabled() ? { csrf_token: "mock" } : authApi.csrf(),

  signup: async (
    name: string,
    email: string,
    password: string,
    _organisation_name?: string,
  ) => {
    if (isMockEnabled()) {
      const existing = findUserByEmail(email);
      if (existing) {
        throw new Error("An account with this email already exists. Please log in instead.");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }
      const db = getUsersDB();
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: simpleHash(password),
        role: "ANALYST",
      };
      db.push(newUser);
      saveUsersDB(db);
      const authUser = toAuthUser(newUser);
      setCurrentUser(authUser);
      return { user: authUser };
    }
    return authApi.signup({ name, email, password, organisation_name: _organisation_name });
  },

  login: async (email: string, password: string, remember_me = true) => {
    if (isMockEnabled()) {
      const stored = findUserByEmail(email);
      if (!stored) {
        throw new Error("No account found with this email. Please sign up first.");
      }
      if (stored.passwordHash !== simpleHash(password)) {
        throw new Error("Incorrect password. Please try again.");
      }
      const authUser = toAuthUser(stored);
      setCurrentUser(authUser);
      return { user: authUser };
    }
    return authApi.login({ email, password, remember_me });
  },

  me: async () => {
    if (isMockEnabled()) {
      const user = getCurrentUser();
      if (!user) {
        throw new Error("No active session");
      }
      return user;
    }
    return authApi.me();
  },

  refresh: async () => {
    if (isMockEnabled()) {
      const user = getCurrentUser();
      if (!user) {
        throw new Error("No active session");
      }
      return { user };
    }
    return authApi.refresh();
  },

  logout: async () => {
    if (isMockEnabled()) {
      clearCurrentUser();
      return;
    }
    await authApi.logout();
  },

  forgotPassword: async (email: string) => {
    if (isMockEnabled()) {
      const stored = findUserByEmail(email);
      if (!stored) {
        return { message: "If that email exists, reset instructions were sent." };
      }
      return { message: "Password reset link sent to your email." };
    }
    return authApi.forgotPassword(email);
  },

  resetPassword: async (token: string, newPassword: string) => {
    if (isMockEnabled()) {
      return { message: "Password updated successfully." };
    }
    return authApi.resetPassword(token, newPassword);
  },
};
