import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";

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

export interface NewsBalancerPayload {
  topic: string;
  perspective_a: string;
  perspective_b: string;
}

export interface CareerPayload {
  interests: string[];
  skills: string[];
  location: string;
  budget: number;
  goals: string[];
}

export interface FinancialAssistantPayload {
  scenario: string;
  options: DecisionOption[];
}

export interface PurchaseEvaluatorPayload {
  product_category: string;
  options: DecisionOption[];
  priorities: string[];
}

/* ---------- helpers ---------- */
const norm = (v: number) => Math.max(0, Math.min(1, Math.round(v * 1000) / 1000));

const countTerms = (text: string, terms: string[]) => {
  const low = text.toLowerCase();
  return terms.reduce((sum, t) => sum + (low.split(t).length - 1), 0);
};

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/* ---------- mock implementations ---------- */
const mockDecisionAssistant = async (payload: DecisionAssistantPayload) => {
  await delay();
  const ranked = payload.options.map((opt) => {
    const confidence = norm((opt.evidence_score + opt.long_term_score) / 2);
    const neutrality = norm(1 - opt.risk_score * 0.6);
    const composite = norm(confidence * 0.45 + neutrality * 0.3 + (1 - opt.risk_score) * 0.25);
    return {
      name: opt.name,
      pros: opt.pros,
      cons: opt.cons,
      confidence,
      risk: opt.risk_score,
      neutrality,
      composite_score: composite,
      uncertainty: norm(1 - confidence),
    };
  });
  ranked.sort((a, b) => b.composite_score - a.composite_score);
  const avg = ranked.reduce((s, r) => s + r.confidence, 0) / ranked.length;
  return {
    question: payload.question,
    recommendation: ranked[0].name,
    balanced_options: ranked,
    tradeoff_summary:
      "Top option leads on evidence strength, while runner-up may offer lower short-term risk in uncertain environments.",
    missing_information: [
      "Verified third-party evidence for claims.",
      "Personal constraints (time horizon, budget shocks, opportunity cost).",
      "Counterfactual outcome if no decision is taken now.",
    ],
    confidence_overall: norm(avg),
  };
};

const mockBiasDetector = async (text: string) => {
  await delay();
  const emotional = ["outrage", "shocking", "fear", "panic", "hate", "disaster", "betrayal", "urgent"];
  const propaganda = ["they don't want you to know", "wake up", "mainstream lies", "enemy", "traitor"];
  const certainty = ["always", "never", "obvious", "undeniable", "everyone knows"];
  const lenFactor = Math.max(1, text.split(/\s+/).length / 120);
  const eHits = countTerms(text, emotional);
  const pHits = countTerms(text, propaganda);
  const cHits = countTerms(text, certainty);
  const manipulation = norm((eHits * 0.3 + pHits * 0.5 + cHits * 0.2) / lenFactor / 5);
  let political_leaning: "left" | "right" | "mixed" | "unclear" = "unclear";
  const low = text.toLowerCase();
  if (low.includes("tax cuts") || low.includes("border security")) political_leaning = "right";
  else if (low.includes("climate justice") || low.includes("wealth tax")) political_leaning = "left";
  else if (["however", "on the other hand", "multiple views"].some((t) => low.includes(t))) political_leaning = "mixed";

  return {
    manipulation_meter: manipulation,
    emotional_intensity: norm(Math.min(1, eHits / (lenFactor * 6))),
    political_leaning,
    factual_confidence: norm(0.7 - manipulation * 0.4),
    neutrality_score: norm(1 - manipulation),
    missing_context: [
      "Primary evidence sources are not cited.",
      "Counterarguments are minimally represented.",
      "Absolute claims should be replaced with probabilistic language.",
    ],
    balanced_rewrite:
      "The claim may be directionally valid, but evidence quality and alternative explanations should be reviewed before strong conclusions.",
  };
};

const mockDebateAnalyzer = async (text: string) => {
  await delay();
  const fallacyTerms = ["everyone knows", "strawman", "you people", "obviously wrong", "either you are with us"];
  const evidenceTerms = ["study", "data", "report", "source", "sample", "method"];
  const fHits = countTerms(text, fallacyTerms);
  const eHits = countTerms(text, evidenceTerms);
  const logicStrength = norm(Math.min(1, (eHits + 1) / (fHits + eHits + 2)));
  return {
    logic_strength_score: logicStrength,
    fallacy_indicators: [
      text.toLowerCase().includes("either") ? "Potential false dichotomy" : "No strong dichotomy detected",
      text.toLowerCase().includes("fear") ? "Potential appeal to emotion" : "Low explicit emotional appeal",
    ],
    evidence_quality: norm(Math.min(1, eHits / 8)),
    argument_breakdown: [
      { segment: "Claim quality", score: norm(logicStrength * 0.9) },
      { segment: "Evidence traceability", score: norm(Math.min(1, eHits / 7)) },
      { segment: "Neutral framing", score: norm(1 - Math.min(1, fHits / 6)) },
    ],
  };
};

const mockNewsBalancer = async (payload: NewsBalancerPayload) => {
  await delay();
  const aLen = payload.perspective_a.split(/\s+/).length;
  const bLen = payload.perspective_b.split(/\s+/).length;
  const asymmetry = Math.abs(aLen - bLen) / Math.max(1, (aLen + bLen) / 2);
  const sourceDiversity = norm(0.9 - asymmetry * 0.4);
  const neutralityHeat = norm(0.82 - asymmetry * 0.35);
  return {
    topic: payload.topic,
    perspectives: [
      { label: "Perspective A", summary: payload.perspective_a.slice(0, 240) },
      { label: "Perspective B", summary: payload.perspective_b.slice(0, 240) },
    ],
    timeline: [
      { stage: "Initial claim", confidence: 0.63 },
      { stage: "Counter evidence", confidence: 0.74 },
      { stage: "Consensus estimate", confidence: 0.69 },
    ],
    source_diversity_indicator: sourceDiversity,
    neutrality_heatmap: neutralityHeat,
    facts_vs_opinion: {
      fact_density: norm(0.65 + sourceDiversity * 0.2),
      opinion_density: norm(0.35 - sourceDiversity * 0.1),
    },
  };
};

const mockCareerEngine = async (payload: CareerPayload) => {
  await delay();
  const skillDepth = Math.min(1, payload.skills.length / 12);
  const goalClarity = Math.min(1, payload.goals.length / 6);
  const budgetSignal = payload.budget >= 10000 ? 0.7 : 0.45;
  return {
    location: payload.location,
    skill_gap_score: norm(1 - skillDepth * 0.7),
    education_roi_score: norm(goalClarity * 0.45 + budgetSignal * 0.55),
    career_paths: [
      {
        role: "Data Governance Analyst",
        salary_band_usd: "78k-124k",
        growth_potential: norm(0.82),
        automation_risk: norm(0.31),
        stress_index: norm(0.57),
      },
      {
        role: "AI Product Strategist",
        salary_band_usd: "98k-162k",
        growth_potential: norm(0.86),
        automation_risk: norm(0.26),
        stress_index: norm(0.62),
      },
      {
        role: "Fairness Engineering Lead",
        salary_band_usd: "110k-185k",
        growth_potential: norm(0.91),
        automation_risk: norm(0.18),
        stress_index: norm(0.68),
      },
    ],
  };
};

const mockFinancialAssistant = async (payload: FinancialAssistantPayload) => {
  await delay();
  const ranked = payload.options.map((opt) => ({
    name: opt.name,
    risk_radar: opt.risk_score,
    hidden_fee_detection: norm(opt.risk_score * 0.6),
    long_term_impact: norm(opt.long_term_score * 0.7 + opt.evidence_score * 0.3),
    net_score: norm((1 - opt.risk_score) * 0.5 + opt.long_term_score * 0.35 + opt.evidence_score * 0.15),
  }));
  ranked.sort((a, b) => b.net_score - a.net_score);
  return {
    scenario: payload.scenario,
    comparison: ranked,
    recommended_option: ranked[0].name,
    projection_note: "Projection assumes stable macro conditions and excludes black swan events.",
  };
};

const mockPurchaseEvaluator = async (payload: PurchaseEvaluatorPayload) => {
  await delay();
  const scored = payload.options.map((opt) => ({
    name: opt.name,
    value_for_money: norm(opt.evidence_score * 0.4 + opt.long_term_score * 0.4 + (1 - opt.risk_score) * 0.2),
    longevity_score: norm(opt.long_term_score),
    repairability_score: norm(0.6 + opt.long_term_score * 0.2),
    hype_probability: norm(opt.risk_score * 0.5 + (1 - opt.evidence_score) * 0.3),
    risk_score: opt.risk_score,
  }));
  scored.sort((a, b) => b.value_for_money - a.value_for_money);
  return {
    product_category: payload.product_category,
    priorities: payload.priorities,
    comparison: scored,
    recommended_option: scored[0].name,
  };
};

const MOCK_HISTORY_KEY = "equiaudit_pi_history";

const saveMockHistory = (type: string) => {
  try {
    const raw = localStorage.getItem(MOCK_HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({
      id: Date.now(),
      analysis_type: type,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(arr.slice(0, 50)));
  } catch {
    // ignore
  }
};

const getMockHistory = () => {
  try {
    const raw = localStorage.getItem(MOCK_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/* ---------- exported API ---------- */
export const publicIntelligenceApi = {
  runDecisionAssistant: async (payload: DecisionAssistantPayload) => {
    if (isMockEnabled()) {
      const result = await mockDecisionAssistant(payload);
      saveMockHistory("decision_assistant");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/decision-assistant", payload);
    return response.data;
  },

  runBiasDetector: async (text: string) => {
    if (isMockEnabled()) {
      const result = await mockBiasDetector(text);
      saveMockHistory("bias_detector");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/bias-detector", { text });
    return response.data;
  },

  runDebateAnalyzer: async (text: string) => {
    if (isMockEnabled()) {
      const result = await mockDebateAnalyzer(text);
      saveMockHistory("debate_analyzer");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/debate-analyzer", { text });
    return response.data;
  },

  runNewsBalancer: async (payload: NewsBalancerPayload) => {
    if (isMockEnabled()) {
      const result = await mockNewsBalancer(payload);
      saveMockHistory("news_balancer");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/news-balancer", payload);
    return response.data;
  },

  runCareerEngine: async (payload: CareerPayload) => {
    if (isMockEnabled()) {
      const result = await mockCareerEngine(payload);
      saveMockHistory("career_engine");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/career-engine", payload);
    return response.data;
  },

  runFinancialAssistant: async (payload: FinancialAssistantPayload) => {
    if (isMockEnabled()) {
      const result = await mockFinancialAssistant(payload);
      saveMockHistory("financial_assistant");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/financial-assistant", payload);
    return response.data;
  },

  runPurchaseEvaluator: async (payload: PurchaseEvaluatorPayload) => {
    if (isMockEnabled()) {
      const result = await mockPurchaseEvaluator(payload);
      saveMockHistory("purchase_evaluator");
      return result;
    }
    const response = await apiClient.post("/public-intelligence/purchase-evaluator", payload);
    return response.data;
  },

  getHistory: async (analysis_type?: string) => {
    if (isMockEnabled()) {
      await delay(200);
      const all = getMockHistory();
      if (analysis_type) {
        return all.filter((h: { analysis_type: string }) => h.analysis_type === analysis_type);
      }
      return all;
    }
    const response = await apiClient.get("/public-intelligence/history", {
      params: analysis_type ? { analysis_type } : {},
    });
    return response.data;
  },
};
