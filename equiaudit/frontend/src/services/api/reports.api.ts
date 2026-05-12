// Reports API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

let mockReports = [
  {
    id: "mock-1",
    title: "EU AI Act Compliance",
    status: "READY",
    generated_at: "2026-05-11 10:22",
  },
  {
    id: "mock-2",
    title: "EEOC Fairness Summary",
    status: "READY",
    generated_at: "2026-05-11 10:31",
  },
];

export const reportsApi = {
  listReports: async () => {
    if (isMockEnabled()) {
      return mockReports;
    }
    const response = await apiClient.get("/reports");

    return response.data;
  },

  generateReport: async () => {
    if (isMockEnabled()) {
      const newReport = {
        id: `mock-${Date.now()}`,
        title: "On-demand Compliance Export",
        status: "READY",
        generated_at: new Date().toISOString(),
      };
      mockReports = [newReport, ...mockReports];
      return newReport;
    }
    const response = await apiClient.post("/reports/generate");

    return response.data;
  },

  downloadReport: async (
    reportId: string,
    format: "pdf" | "json" | "txt" = "pdf"
  ) => {
    if (isMockEnabled()) {
      return new Blob(
        [`Mock report generated for ${reportId}.`],
        { type: "text/plain" }
      );
    }
    const response =
      await apiClient.get(
        `/reports/${reportId}/download`,
        {
          responseType: "blob",
          params: { format },
        }
      );

    return response.data;
  },
};