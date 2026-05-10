// Auth API methods
import { apiClient } from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: async (
    payload: LoginPayload
  ) => {
    const response =
      await apiClient.post(
        "/auth/login",
        payload
      );

    return response.data;
  },

  refresh: async (
    refreshToken: string
  ) => {
    const response =
      await apiClient.post(
        "/auth/refresh",
        {
          refreshToken,
        }
      );

    return response.data;
  },

  me: async () => {
    const response =
      await apiClient.get("/users/me");

    return response.data;
  },
};