// Audit logs API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";
import { auditLogs } from "../../assets/mock/auditLogs";

export const auditLogsApi = {
  getAuditLogs: async () => {
    if (isMockEnabled()) {
      return auditLogs;
    }
    const response = await apiClient.get("/audit-logs");

    return response.data;
  },
};
