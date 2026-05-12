const MOCK_KEY = "equiaudit_mock_enabled";

export const isMockEnabled = (): boolean => {
  // First check env var
  const envFlag = import.meta.env.VITE_ENABLE_MOCK_DATA;
  if (envFlag === "true") return true;
  if (envFlag === "false") return false;
  // Fallback: check localStorage override
  return localStorage.getItem(MOCK_KEY) === "true";
};

export const setMockEnabled = (enabled: boolean): void => {
  localStorage.setItem(MOCK_KEY, String(enabled));
};
