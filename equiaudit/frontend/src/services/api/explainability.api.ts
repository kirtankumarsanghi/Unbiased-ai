import { apiClient } from "./axios";

export interface ExplainabilityPayload {
  features: Record<string, number>;
  top_k?: number;
}

export interface ShapPayload extends ExplainabilityPayload {
  baseline?: Record<string, number>;
}

export interface LimePayload extends ExplainabilityPayload {
  weights?: Record<string, number>;
}

export interface ProxyDetectionPayload {
  features: string[];
  sensitive_keywords?: string[];
}

export interface ExplainabilityAssistantPayload {
  question: string;
  analysis_context?: Record<string, unknown>;
}

/* ---------- helpers ---------- */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const norm = (v: number) => Math.max(0, Math.min(1, Math.round(v * 1000) / 1000));

/* ---------- mock implementations ---------- */

const mockShap = async (payload: ShapPayload) => {
  await delay();
  const features = payload.features;
  const baseline = payload.baseline || {};
  const topK = payload.top_k || 5;

  // Calculate SHAP-like values: deviation from baseline
  const entries = Object.entries(features).map(([key, val]) => {
    const baseVal = baseline[key] ?? 0;
    const shapValue = val - baseVal;
    const importance = Math.abs(shapValue);
    return { feature: key, shap_value: Math.round(shapValue * 1000) / 1000, importance: norm(importance) };
  });

  entries.sort((a, b) => b.importance - a.importance);
  const topFeatures = entries.slice(0, topK);
  const totalImportance = topFeatures.reduce((s, f) => s + f.importance, 0) || 1;

  return {
    method: "SHAP",
    top_features: topFeatures.map((f) => ({
      feature: f.feature,
      importance: norm(f.importance / totalImportance),
      shap_value: f.shap_value,
      direction: f.shap_value >= 0 ? "positive" : "negative",
    })),
    base_prediction: norm(Object.values(baseline).reduce((s, v) => s + v, 0) / Math.max(1, Object.keys(baseline).length)),
    model_output: norm(Object.values(features).reduce((s, v) => s + v, 0) / Math.max(1, Object.keys(features).length)),
  };
};

const mockLime = async (payload: LimePayload) => {
  await delay();
  const features = payload.features;
  const weights = payload.weights || {};
  const topK = payload.top_k || 5;

  const entries = Object.entries(features).map(([key, val]) => {
    const weight = weights[key] ?? 1.0;
    const importance = norm(val * weight);
    return { feature: key, importance, weight: Math.round(weight * 100) / 100 };
  });

  entries.sort((a, b) => b.importance - a.importance);
  const topFeatures = entries.slice(0, topK);
  const totalImportance = topFeatures.reduce((s, f) => s + f.importance, 0) || 1;

  return {
    method: "LIME",
    top_features: topFeatures.map((f) => ({
      feature: f.feature,
      importance: norm(f.importance / totalImportance),
      lime_weight: f.weight,
      contribution: f.importance > 0.5 ? "high" : f.importance > 0.25 ? "medium" : "low",
    })),
    model_fidelity: norm(0.85 + Math.random() * 0.1),
    intercept: norm(0.3 + Math.random() * 0.2),
  };
};

const mockCounterfactual = async (payload: ExplainabilityPayload) => {
  await delay();
  const features = payload.features;
  const topK = payload.top_k || 3;

  const entries = Object.entries(features)
    .map(([key, val]) => {
      // Suggest a change that would flip the outcome
      const delta = val > 0.5 ? -(0.15 + Math.random() * 0.2) : 0.15 + Math.random() * 0.2;
      const suggested = norm(val + delta);
      return {
        feature: key,
        current: Math.round(val * 100) / 100,
        suggested: Math.round(suggested * 100) / 100,
        change_magnitude: Math.abs(delta),
      };
    })
    .sort((a, b) => a.change_magnitude - b.change_magnitude);

  return {
    method: "Counterfactual",
    counterfactuals: entries.slice(0, topK).map((e) => ({
      feature: e.feature,
      current: e.current,
      suggested: e.suggested,
      change_needed: Math.round(Math.abs(e.suggested - e.current) * 100) / 100,
    })),
    outcome_flip_probability: norm(0.7 + Math.random() * 0.2),
    feasibility_score: norm(0.6 + Math.random() * 0.25),
  };
};

const mockProxyDetection = async (payload: ProxyDetectionPayload) => {
  await delay();
  const sensitiveDefaults = ["race", "gender", "sex", "ethnicity", "religion", "age", "disability", "national_origin"];
  const sensitiveKeywords = payload.sensitive_keywords || sensitiveDefaults;

  const flagged = payload.features
    .map((feature) => {
      const featureLow = feature.toLowerCase().replace(/[_\- ]+/g, "");
      const isHighRisk = sensitiveKeywords.some((kw) => featureLow.includes(kw.toLowerCase().replace(/[_\- ]+/g, "")));
      const isProxy =
        featureLow.includes("zip") ||
        featureLow.includes("postal") ||
        featureLow.includes("neighborhood") ||
        featureLow.includes("surname") ||
        featureLow.includes("bucket");

      let risk: "high" | "medium" | "low" = "low";
      let riskScore = 0.15;
      if (isHighRisk) {
        risk = "high";
        riskScore = 0.85 + Math.random() * 0.1;
      } else if (isProxy) {
        risk = "medium";
        riskScore = 0.5 + Math.random() * 0.2;
      }

      return { feature, risk, risk_score: norm(riskScore) };
    })
    .filter((f) => f.risk !== "low");

  const overallRisk =
    flagged.length === 0
      ? 0.05
      : flagged.reduce((s, f) => s + f.risk_score, 0) / flagged.length;

  return {
    risk_score: norm(overallRisk),
    total_features_analyzed: payload.features.length,
    flagged_count: flagged.length,
    flagged,
    recommendation:
      flagged.length === 0
        ? "No proxy features detected. Feature set appears clean."
        : `${flagged.length} potential proxy feature(s) detected. Review flagged features for potential discriminatory correlation.`,
  };
};

/* ---------- exported API ---------- */
export const explainabilityApi = {
  runShap: async (payload: ShapPayload) => {
    const response = await apiClient.post("/explainability/shap", payload);
    return response.data;
  },

  runLime: async (payload: LimePayload) => {
    const response = await apiClient.post("/explainability/lime", payload);
    return response.data;
  },

  runCounterfactual: async (payload: ExplainabilityPayload) => {
    const response = await apiClient.post("/explainability/counterfactual", payload);
    return response.data;
  },

  runProxyDetection: async (payload: ProxyDetectionPayload) => {
    const response = await apiClient.post("/explainability/proxy-detection", payload);
    return response.data;
  },

  askExplainabilityAssistant: async (payload: ExplainabilityAssistantPayload) => {
    const response = await apiClient.post("/explainability/assistant", payload);
    return response.data;
  },
};
