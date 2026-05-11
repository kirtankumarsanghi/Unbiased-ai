// Audits API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

const mockMetrics = {
  demographic_parity: 0.92,
  equalized_odds: 0.87,
  disparate_impact: 0.82,
};

export const auditsApi = {
  runAudit: async (
    modelId: string
  ) => {
    if (isMockEnabled()) {
      return { audit_id: `mock-audit-${modelId}` };
    }
    const response =
      await apiClient.post(
        `/audits/run/${modelId}`
      );

    return response.data;
  },

  getMetrics: async (
    auditId: string
  ) => {
    if (isMockEnabled()) {
      return mockMetrics;
    }
    const response =
      await apiClient.get(
        `/audits/${auditId}/metrics`
      );

    return response.data;
  },

  getShapValues: async (
    auditId: string
  ) => {
    if (isMockEnabled()) {
      return {
        audit_id: auditId,
        features: [
          { name: "Age", value: 0.21 },
          { name: "Income", value: 0.17 },
          { name: "Education", value: 0.13 },
        ],
      };
    }
    const response =
      await apiClient.get(
        `/audits/${auditId}/shap`
      );

    return response.data;
  },

  getDemographicParity:
    async (auditId: string) => {
      if (isMockEnabled()) {
        return {
          audit_id: auditId,
          parity_index: 0.91,
          groups: [
            { label: "Group A", score: 0.93 },
            { label: "Group B", score: 0.89 },
          ],
        };
      }
      const response =
        await apiClient.get(
          `/audits/${auditId}/demographic-parity`
        );

      return response.data;
    },
};