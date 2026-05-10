// API endpoint constants
export const API = {
  BASE_URL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api/v1",

  TIMEOUT: 30000,

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REFRESH: "/auth/refresh",
      ME: "/users/me",
    },

    MODELS: {
      LIST: "/models",
      UPLOAD: "/models/upload",
      DETAILS: (id: string) => `/models/${id}`,
      DELETE: (id: string) => `/models/${id}`,
    },

    AUDITS: {
      RUN: (id: string) =>
        `/audits/run/${id}`,

      METRICS: (id: string) =>
        `/audits/${id}/metrics`,
    },

    REPORTS: {
      GENERATE: (id: string) =>
        `/reports/generate/${id}`,
    },
  },
};