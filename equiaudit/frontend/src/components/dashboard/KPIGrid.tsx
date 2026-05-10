import { useQuery } from "@tanstack/react-query";

import MetricCard from "../common/MetricCard";

import { metricsApi } from "../../services/api/metrics.api";

interface MetricItem {
  label: string;
  value: string | number;
  trend?: string;
}

export default function KPIGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["kpi-summary"],
    queryFn: metricsApi.getSummary,
  });

  const metrics = Array.isArray(data?.metrics)
    ? (data.metrics as MetricItem[])
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`metric-skeleton-${index}`}
            className="bg-surface border border-border p-6 animate-pulse"
          >
            <div className="h-3 w-24 bg-surface-light" />
            <div className="mt-6 h-8 w-20 bg-surface-light" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error/10 border border-error p-6 text-sm text-error">
        Unable to load KPI summary.
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="bg-surface border border-border p-6 text-sm text-muted">
        No KPI data available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          trend={metric.trend}
        />
      ))}
    </div>
  );
}
