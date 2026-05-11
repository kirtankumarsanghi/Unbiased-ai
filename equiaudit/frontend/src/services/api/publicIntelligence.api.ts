import { apiClient } from "./axios";

export interface DecisionOption {
  name: string;
  pros: string[];
  cons: string[];
  evidence_score: number;
  risk_score: number;
  long_term_score: number;
}

export interface DecisionAssistantPayload {
  question: string;
  options: DecisionOption[];
}

export const publicIntelligenceApi = {
  runDecisionAssistant: async (payload: DecisionAssistantPayload) => {
    const response = await apiClient.post(
      "/public-intelligence/decision-assistant",
      payload
    );
    return response.data;
  },

  runBiasDetector: async (text: string) => {
    const response = await apiClient.post(
      "/public-intelligence/bias-detector",
      { text }
    );
    return response.data;
  },

  runDebateAnalyzer: async (text: string) => {
    const response = await apiClient.post(
      "/public-intelligence/debate-analyzer",
      { text }
    );
    return response.data;
  },
};
