// Reports API methods
import { apiClient } from "./axios";

export const reportsApi = {
  listReports: async () => {
    const response = await apiClient.get("/reports");

    return response.data;
  },

  generateReport: async () => {
    const response = await apiClient.post("/reports/generate");

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