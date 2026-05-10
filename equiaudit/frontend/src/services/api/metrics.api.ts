// Metrics API methods
import { apiClient } from "./axios";

export const metricsApi = {
  getSummary: async () => {
    const response = await apiClient.get("/metrics/summary");

    return response.data;
  },
};
