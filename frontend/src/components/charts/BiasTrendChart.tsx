import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TrendPoint {
  day: string;
  value: number;
}

interface Props {
  data: TrendPoint[];
}

export default function BiasTrendChart({
  data,
}: Props) {
  return (
    <div className="bg-surface border border-border p-6 h-[400px]">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Bias Drift Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            stroke="#3a4a46"
            strokeDasharray="3 3"
          />

          <XAxis dataKey="day" stroke="#b9cac4" />

          <YAxis stroke="#b9cac4" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#00dfc1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
