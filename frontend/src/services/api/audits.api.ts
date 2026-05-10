// Audits API methods
import { apiClient } from "./axios";

export const auditsApi = {
  runAudit: async (
    modelId: string
  ) => {
    const response =
      await apiClient.post(
        `/audits/run/${modelId}`
      );

    return response.data;
  },

  getMetrics: async (
    auditId: string
  ) => {
    const response =
      await apiClient.get(
        `/audits/${auditId}/metrics`
      );

    return response.data;
  },

  getShapValues: async (
    auditId: string
  ) => {
    const response =
      await apiClient.get(
        `/audits/${auditId}/shap`
      );

    return response.data;
  },

  getDemographicParity:
    async (auditId: string) => {
      const response =
        await apiClient.get(
          `/audits/${auditId}/demographic-parity`
        );

      return response.data;
    },
};