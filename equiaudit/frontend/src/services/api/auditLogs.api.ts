// Audit logs API methods
import { apiClient } from "./axios";

export const auditLogsApi = {
  getAuditLogs: async () => {
    const response = await apiClient.get("/audit-logs");

    return response.data;
  },
};
