// Fairness metric constants
export const FAIRNESS = {
  THRESHOLDS: {
    DEMOGRAPHIC_PARITY: 0.8,

    EQUAL_OPPORTUNITY: 0.85,

    EQUALIZED_ODDS: 0.85,

    DISPARATE_IMPACT: 0.8,

    CALIBRATION_SCORE: 0.9,
  },

  METRICS: [
    "Demographic Parity",

    "Equal Opportunity",

    "Equalized Odds",

    "Disparate Impact",

    "Calibration Score",

    "Theil Index",
  ],

  STATUS: {
    SAFE: "SAFE",

    WARNING: "WARNING",

    CRITICAL: "CRITICAL",
  },
};