interface Props {
  label: string;
  value: string | number;
  trend?: string;
}

export default function MetricCard({
  label,
  value,
  trend,
}: Props) {
  return (
    <div className="bg-surface border border-border p-6">
      <p className="text-xs uppercase tracking-widest text-muted">
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-semibold text-primary">
          {value}
        </span>

        {trend && (
          <span className="text-xs uppercase tracking-widest text-primary">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
