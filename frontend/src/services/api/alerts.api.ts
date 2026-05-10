// Alerts API methods
import { apiClient } from "./axios";

export const alertsApi = {
  getAlerts: async () => {
    const response =
      await apiClient.get("/alerts");

    return response.data;
  },

  updateThresholds:
    async (payload: unknown) => {
      const response =
        await apiClient.post(
          "/alerts/thresholds",
          payload
        );

      return response.data;
    },
};