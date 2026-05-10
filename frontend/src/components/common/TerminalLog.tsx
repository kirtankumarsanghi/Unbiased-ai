interface Log {
  id: number;
  level: string;
  timestamp: string;
  message: string;
}

interface Props {
  logs: Log[];
}

const levelStyles: Record<string, string> = {
  INFO: "text-primary",
  WARN: "text-warning",
  SYSTEM: "text-muted",
  ACTION: "text-primary",
  CRITICAL: "text-error",
};

export default function TerminalLog({
  logs,
}: Props) {
  return (
    <div className="bg-surface border border-border p-6 font-mono text-sm max-h-[320px] overflow-y-auto">
      <div className="mb-4 text-primary uppercase tracking-widest text-xs">
        Audit Log Stream
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex gap-4"
          >
            <span className="text-muted">
              [{log.timestamp}]
            </span>

            <span
              className={
                levelStyles[log.level] ||
                "text-primary"
              }
            >
              [{log.level}]
            </span>

            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
