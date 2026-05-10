// Reports API methods
import { apiClient } from "./axios";

export const reportsApi = {
  generateReport: async (
    modelId: string
  ) => {
    const response =
      await apiClient.post(
        `/reports/generate/${modelId}`
      );

    return response.data;
  },

  downloadReport: async (
    reportId: string
  ) => {
    const response =
      await apiClient.get(
        `/reports/${reportId}/download`,
        {
          responseType: "blob",
        }
      );

    return response.data;
  },
};