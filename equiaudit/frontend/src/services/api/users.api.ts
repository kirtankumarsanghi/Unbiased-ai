// Users API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

export const usersApi = {
  getCurrentUser: async () => {
    if (isMockEnabled()) {
      const raw = localStorage.getItem("equiaudit_mock_user");
      return raw ? JSON.parse(raw) : null;
    }
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  getUsers: async () => {
    if (isMockEnabled()) {
      return [
        { id: "1", name: "Platform Admin", email: "admin@equiaudit.ai", role: "SUPER_ADMIN" },
        { id: "2", name: "Fairness Analyst", email: "analyst@equiaudit.ai", role: "ANALYST" },
      ];
    }
    const response = await apiClient.get("/users");
    return response.data;
  },
};