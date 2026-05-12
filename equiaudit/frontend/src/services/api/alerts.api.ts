// Alerts API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

const mockAlerts = [
  {
    id: 1,
    type: "BIAS_DRIFT",
    severity: "HIGH",
    model_name: "RiskEval",
    message: "Disparate impact detected in Age_Bracket_3",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    resolved: false,
  },
  {
    id: 2,
    type: "THRESHOLD_BREACH",
    severity: "MEDIUM",
    model_name: "HireScore",
    message: "Demographic parity dropped below 0.85 threshold",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    resolved: false,
  },
  {
    id: 3,
    type: "DATA_DRIFT",
    severity: "LOW",
    model_name: "HireScore",
    message: "Input distribution shift detected in income feature",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    resolved: true,
  },
];

export const alertsApi = {
  getAlerts: async () => {
    if (isMockEnabled()) {
      return mockAlerts;
    }
    const response = await apiClient.get("/alerts");
    return response.data;
  },

  updateThresholds: async (payload: unknown) => {
    if (isMockEnabled()) {
      return { message: "Thresholds updated", ...((payload as Record<string, unknown>) || {}) };
    }
    const response = await apiClient.post("/alerts/thresholds", payload);
    return response.data;
  },
};