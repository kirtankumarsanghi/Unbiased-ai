// Auth API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

export interface LoginPayload {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  organisation_name?: string;
}

export const authApi = {
  status: async () => {
    if (isMockEnabled()) {
      return { status: "ok", auth: "ready", mock: true };
    }
    const response = await apiClient.get("/auth/status");
    return response.data;
  },

  csrf: async () => {
    if (isMockEnabled()) {
      return { csrf_token: "mock" };
    }
    const response = await apiClient.get("/auth/csrf");
    return response.data;
  },

  signup: async (payload: SignupPayload) => {
    const response = await apiClient.post("/auth/signup", payload);
    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  refresh: async (refreshToken?: string) => {
    if (isMockEnabled()) {
      return { user: null };
    }
    const response = await apiClient.post(
      "/auth/refresh",
      refreshToken ? { refreshToken } : {},
    );
    return response.data;
  },

  logout: async () => {
    if (isMockEnabled()) {
      return { message: "Logged out" };
    }
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token: string, new_password: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      new_password,
    });
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
};
