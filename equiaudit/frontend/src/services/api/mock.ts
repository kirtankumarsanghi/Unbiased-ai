const MOCK_KEY = "equiaudit_mock_enabled";

export const isMockEnabled = (): boolean => {
  // 1. Explicit env var takes highest priority
  const envFlag = import.meta.env.VITE_ENABLE_MOCK_DATA;
  if (envFlag === "true") return true;
  if (envFlag === "false") return false;

  // 2. Fallback: check localStorage override (set by auto-detection below)
  const stored = localStorage.getItem(MOCK_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;

  // 3. Default to true so the app always works without a backend
  return true;
};

export const setMockEnabled = (enabled: boolean): void => {
  localStorage.setItem(MOCK_KEY, String(enabled));
};

/**
 * Probe the backend once on startup. If it's unreachable, permanently
 * enable mock mode for this session so no "Network Error" ever appears.
 */
export const autoDetectBackend = async (): Promise<void> => {
  // If env already forces a value, respect it — don't probe
  const envFlag = import.meta.env.VITE_ENABLE_MOCK_DATA;
  if (envFlag === "true" || envFlag === "false") return;

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${baseUrl.replace(/\/api\/v1$/, "")}/`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    // Backend is reachable — disable mock
    if (res.ok || res.status < 500) {
      setMockEnabled(false);
    } else {
      setMockEnabled(true);
    }
  } catch {
    // Backend unreachable — enable mock silently
    setMockEnabled(true);
  }
};
