// Utility: fairness functions
export function getFairnessStatus(
  value: number
) {
  if (value >= 0.9) {
    return "SAFE";
  }

  if (value >= 0.75) {
    return "WARNING";
  }

  return "CRITICAL";
}

export function calculateBiasDelta(
  current: number,
  previous: number
) {
  return Number(
    (current - previous).toFixed(3)
  );
}