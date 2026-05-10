// Interventions API methods
import { apiClient } from "./axios";

export const interventionsApi = {
  getInterventions: async () => {
    const response = await apiClient.get("/interventions");

    return response.data;
  },

  enableIntervention:
    async (
      modelId: string,
      intervention: string
    ) => {
      const response =
        await apiClient.post(
          `/interventions/${modelId}/enable`,
          {
            intervention,
          }
        );

      return response.data;
    },

  disableIntervention:
    async (
      modelId: string,
      intervention: string
    ) => {
      const response =
        await apiClient.post(
          `/interventions/${modelId}/disable`,
          {
            intervention,
          }
        );

      return response.data;
    },

  previewIntervention:
    async (modelId: string) => {
      const response =
        await apiClient.get(
          `/interventions/${modelId}/preview`
        );

      return response.data;
    },
};