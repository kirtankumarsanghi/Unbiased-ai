// Users API methods
import { apiClient } from "./axios";

export const usersApi = {
  getCurrentUser: async () => {
    const response =
      await apiClient.get("/users/me");

    return response.data;
  },

  getUsers: async () => {
    const response =
      await apiClient.get("/users");

    return response.data;
  },
};