// useAuditMetrics hook
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { API } from "../constants";

export function useAuditMetrics(
  auditId: string
) {
  return useQuery({
    queryKey: ["audit-metrics", auditId],

    queryFn: async () => {
      const response = await axios.get(
        `${API.BASE_URL}${API.ENDPOINTS.AUDITS.METRICS(
          auditId
        )}`
      );

      return response.data;
    },

    enabled: !!auditId,
  });
}