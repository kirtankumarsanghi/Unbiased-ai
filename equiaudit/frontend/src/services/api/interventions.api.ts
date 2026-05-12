// Interventions API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

const mockInterventions = [
  {
    id: 1,
    name: "Reweighing",
    status: "ACTIVE",
    fairness_gain: "+14%",
    accuracy_tradeoff: "-1.2%",
    processing_time: "12s",
  },
  {
    id: 2,
    name: "Adversarial Debiasing",
    status: "STANDBY",
    fairness_gain: "+18%",
    accuracy_tradeoff: "-2.1%",
    processing_time: "30s",
  },
  {
    id: 3,
    name: "Reject Option Classification",
    status: "ACTIVE",
    fairness_gain: "+9%",
    accuracy_tradeoff: "-0.8%",
    processing_time: "8s",
  },
];

export const interventionsApi = {
  getInterventions: async () => {
    if (isMockEnabled()) {
      return mockInterventions;
    }
    const response = await apiClient.get("/interventions");
    return response.data;
  },

  enableIntervention: async (modelId: string, intervention: string) => {
    if (isMockEnabled()) {
      return { message: `${intervention} enabled for model ${modelId}`, status: "ACTIVE" };
    }
    const response = await apiClient.post(`/interventions/${modelId}/enable`, {
      intervention,
    });
    return response.data;
  },

  disableIntervention: async (modelId: string, intervention: string) => {
    if (isMockEnabled()) {
      return { message: `${intervention} disabled for model ${modelId}`, status: "STANDBY" };
    }
    const response = await apiClient.post(`/interventions/${modelId}/disable`, {
      intervention,
    });
    return response.data;
  },

  previewIntervention: async (modelId: string) => {
    if (isMockEnabled()) {
      return {
        model_id: modelId,
        predicted_fairness_gain: "+12%",
        predicted_accuracy_loss: "-0.9%",
        recommendation: "Reweighing recommended for this model configuration.",
      };
    }
    const response = await apiClient.get(`/interventions/${modelId}/preview`);
    return response.data;
  },
};