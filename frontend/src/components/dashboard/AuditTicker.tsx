import { auditLogs } from "../../assets/mock/auditLogs";

export default function AuditTicker() {
  return (
    <div className="border border-border bg-surface-light p-4 text-xs uppercase tracking-widest text-muted">
      <div className="flex flex-wrap gap-6">
        {auditLogs.map((log) => (
          <span key={log.id}>
            {log.timestamp} :: {log.message}
          </span>
        ))}
      </div>
    </div>
  );
}
