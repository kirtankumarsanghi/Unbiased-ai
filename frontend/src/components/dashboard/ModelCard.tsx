import StatusBadge from "../common/StatusBadge";

interface Props {
  name: string;
  status: "SAFE" | "WARNING" | "CRITICAL";
  metric: string;
}

export default function ModelCard({
  name,
  status,
  metric,
}: Props) {
  return (
    <div className="bg-surface border border-border p-6 hover:border-primary/40 transition-all">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{name}</h3>

        <StatusBadge status={status} />
      </div>

      <div className="mt-6">
        <p className="text-muted text-sm">Bias Index</p>

        <h2 className="text-4xl font-bold text-primary mt-2">
          {metric}
        </h2>
      </div>
    </div>
  );
}
