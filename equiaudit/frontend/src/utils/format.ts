// Utility: format functions
export function formatPercentage(
  value: number
) {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatNumber(
  value: number
) {
  return Intl.NumberFormat().format(
    value
  );
}