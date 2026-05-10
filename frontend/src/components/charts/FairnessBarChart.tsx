import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Metric {
  metric: string;
  value: number;
}

interface Props {
  data: Metric[];
}

export default function FairnessBarChart({
  data,
}: Props) {
  return (
    <div className="bg-surface border border-border p-6 h-[400px]">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Fairness Metrics
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#3a4a46"
          />

          <XAxis
            dataKey="metric"
            stroke="#b9cac4"
          />

          <YAxis stroke="#b9cac4" />

          <Tooltip />

          <Bar dataKey="value" fill="#00dfc1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
