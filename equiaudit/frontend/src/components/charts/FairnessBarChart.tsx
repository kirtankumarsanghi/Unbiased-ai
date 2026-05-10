import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
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
  const palette = ["#00ff88", "#00d4ff", "#ffaa00"];

  return (
    <div className="bg-surface border border-border p-6 h-[400px] shadow-[0_0_0_1px_rgba(0,255,136,0.08),0_18px_40px_rgba(0,0,0,0.28)]">
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

          <Tooltip
            contentStyle={{
              background: "#12121a",
              border: "1px solid #2a2a3a",
            }}
          />

          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`${entry.metric}-${index}`}
                fill={palette[index % palette.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
