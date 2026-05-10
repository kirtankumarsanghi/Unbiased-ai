// Utility: date functions
export function formatDate(
  date: string
) {
  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

export function formatTime(
  date: string
) {
  return new Date(date).toLocaleTimeString(
    "en-US"
  );
}