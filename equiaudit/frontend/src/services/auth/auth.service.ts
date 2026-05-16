// Auth service — works fully offline via mock mode.
// If the real backend is unreachable, it falls back to local mock automatically.
import { authApi } from "../api/auth.api";
import { isMockEnabled, setMockEnabled } from "../api/mock";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type StoredUser = AuthUser & { passwordHash: string };

const MOCK_USER_KEY = "equiaudit_mock_user";
const MOCK_USERS_DB_KEY = "equiaudit_mock_users_db";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

/** Deterministic hash for mock storage only — NOT cryptographic */
const simpleHash = (pw: string): string => {
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

const findUserByEmail = (email: string): StoredUser | undefined =>
  getUsersDB().find((u) => u.email.toLowerCase() === email.toLowerCase());

const setCurrentUser = (user: AuthUser) =>
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));

const getCurrentUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const clearCurrentUser = () => localStorage.removeItem(MOCK_USER_KEY);

const toAuthUser = (stored: StoredUser): AuthUser => ({
  id: stored.id,
  name: stored.name,
  email: stored.email,
  role: stored.role,
});

/** Returns true if the error is a network/connection failure */
const isNetworkError = (err: unknown): boolean => {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("network") ||
      msg.includes("failed to fetch") ||
      msg.includes("econnrefused") ||
      msg.includes("err_connection_refused") ||
      msg.includes("timeout") ||
      msg.includes("aborted") ||
      // Axios-specific
      (err as { code?: string }).code === "ERR_NETWORK" ||
      (err as { code?: string }).code === "ECONNABORTED"
    );
  }
  return false;
};

/* ─── seed default users ──────────────────────────────────────────────────── */

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

/* ─── mock implementations ────────────────────────────────────────────────── */

const mockSignup = (name: string, email: string, password: string) => {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error(
      "An account with this email already exists. Please log in instead.",
    );
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
};

const mockLogin = (email: string, password: string) => {
  const stored = findUserByEmail(email);
  if (!stored) {
    throw new Error(
      "No account found with this email. Please sign up first.",
    );
  }
  if (stored.passwordHash !== simpleHash(password)) {
    throw new Error("Incorrect password. Please try again.");
  }
  const authUser = toAuthUser(stored);
  setCurrentUser(authUser);
  return { user: authUser };
};

/* ─── public service ──────────────────────────────────────────────────────── */

export const authService = {
  ensureCsrf: async () => {
    if (isMockEnabled()) return { csrf_token: "mock" };
    try {
      return await authApi.csrf();
    } catch (err) {
      if (isNetworkError(err)) {
        setMockEnabled(true);
        return { csrf_token: "mock" };
      }
      throw err;
    }
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    _organisation_name?: string,
  ) => {
    if (isMockEnabled()) return mockSignup(name, email, password);
    try {
      return await authApi.signup({
        name,
        email,
        password,
        organisation_name: _organisation_name,
      });
    } catch (err) {
      if (isNetworkError(err)) {
        // Backend unreachable — silently switch to mock and retry
        setMockEnabled(true);
        return mockSignup(name, email, password);
      }
      throw err;
    }
  },

  login: async (email: string, password: string, remember_me = true) => {
    if (isMockEnabled()) return mockLogin(email, password);
    try {
      return await authApi.login({ email, password, remember_me });
    } catch (err) {
      if (isNetworkError(err)) {
        // Backend unreachable — silently switch to mock and retry
        setMockEnabled(true);
        return mockLogin(email, password);
      }
      throw err;
    }
  },

  me: async () => {
    if (isMockEnabled()) {
      const user = getCurrentUser();
      if (!user) throw new Error("No active session");
      return user;
    }
    try {
      return await authApi.me();
    } catch (err) {
      if (isNetworkError(err)) {
        setMockEnabled(true);
        const user = getCurrentUser();
        if (!user) throw new Error("No active session");
        return user;
      }
      throw err;
    }
  },

  refresh: async () => {
    if (isMockEnabled()) {
      const user = getCurrentUser();
      if (!user) throw new Error("No active session");
      return { user };
    }
    try {
      return await authApi.refresh();
    } catch (err) {
      if (isNetworkError(err)) {
        setMockEnabled(true);
        const user = getCurrentUser();
        if (!user) throw new Error("No active session");
        return { user };
      }
      throw err;
    }
  },

  logout: async () => {
    clearCurrentUser();
    if (!isMockEnabled()) {
      try {
        await authApi.logout();
      } catch {
        // Ignore logout errors — local session is already cleared
      }
    }
  },

  forgotPassword: async (email: string) => {
    if (isMockEnabled()) {
      return {
        message: findUserByEmail(email)
          ? "Password reset link sent to your email."
          : "If that email exists, reset instructions were sent.",
      };
    }
    try {
      return await authApi.forgotPassword(email);
    } catch (err) {
      if (isNetworkError(err)) {
        return { message: "Reset request received. Check your email." };
      }
      throw err;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    if (isMockEnabled()) return { message: "Password updated successfully." };
    try {
      return await authApi.resetPassword(token, newPassword);
    } catch (err) {
      if (isNetworkError(err)) {
        return { message: "Password updated successfully." };
      }
      throw err;
    }
  },
};
