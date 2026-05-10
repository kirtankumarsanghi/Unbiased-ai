import { useQuery } from "@tanstack/react-query";

import { auditLogsApi } from "../../services/api/auditLogs.api";

import { AuditLog } from "../../types/audit.types";

export default function AuditTicker() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs", "ticker"],
    queryFn: auditLogsApi.getAuditLogs,
  });

  const logs = Array.isArray(data) ? (data as AuditLog[]) : [];

  return (
    <div className="border border-border bg-surface-light p-4 text-xs uppercase tracking-widest text-muted">
      {isLoading ? (
        <div>Loading telemetry feed...</div>
      ) : isError ? (
        <div>Telemetry feed unavailable.</div>
      ) : logs.length === 0 ? (
        <div>No telemetry updates yet.</div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {logs.map((log) => (
            <span key={log.id}>
              {log.timestamp} :: {log.message}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
