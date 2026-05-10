import MetricCard from "../common/MetricCard";

const metrics = [
  {
    label: "Global Fairness",
    value: "0.93",
    trend: "+2.1%",
  },
  {
    label: "Active Audits",
    value: "18",
    trend: "Realtime",
  },
  {
    label: "Critical Alerts",
    value: "3",
    trend: "High",
  },
  {
    label: "Interventions",
    value: "6",
    trend: "Running",
  },
];

export default function KPIGrid() {
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
