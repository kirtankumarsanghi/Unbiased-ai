import { cn } from "../../utils/cn";

interface Props {
  status: "SAFE" | "WARNING" | "CRITICAL" | string;
}

const statusStyles: Record<string, string> = {
  SAFE: "border-primary/40 text-primary bg-primary/10",
  WARNING: "border-warning/40 text-warning bg-warning/10",
  CRITICAL: "border-error/40 text-error bg-error/10",
};

export default function StatusBadge({
  status,
}: Props) {
  return (
    <span
      className={cn(
        "px-3 py-1 border text-xs uppercase tracking-widest",
        statusStyles[status] ||
          "border-border text-muted"
      )}
    >
      {status}
    </span>
  );
}
