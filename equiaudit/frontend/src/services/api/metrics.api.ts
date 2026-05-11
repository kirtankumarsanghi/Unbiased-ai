// Metrics API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

const mockSummary = {
  metrics: [
    {
      label: "Global Fairness",
      value: 0.93,
      trend: "Live",
    },
    {
      label: "Active Audits",
      value: 4,
      trend: "Realtime",
    },
    {
      label: "Critical Alerts",
      value: 3,
      trend: "High",
    },
    {
      label: "Interventions",
      value: 2,
      trend: "Running",
    },
  ],
};

export const metricsApi = {
  getSummary: async () => {
    if (isMockEnabled()) {
      return mockSummary;
    }
    const response = await apiClient.get("/metrics/summary");

    return response.data;
  },
};
