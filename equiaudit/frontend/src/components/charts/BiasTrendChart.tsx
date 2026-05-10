import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
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
    <div className="bg-surface border border-border p-6 h-[400px] shadow-[0_0_0_1px_rgba(0,212,255,0.08),0_18px_40px_rgba(0,0,0,0.28)]">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Bias Drift Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="driftFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#3a4a46"
            strokeDasharray="3 3"
          />

          <XAxis dataKey="day" stroke="#b9cac4" />

          <YAxis stroke="#b9cac4" />

          <Tooltip
            contentStyle={{
              background: "#12121a",
              border: "1px solid #2a2a3a",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            fill="url(#driftFill)"
            stroke="none"
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#00d4ff"
            strokeWidth={3}
            dot={{ r: 3, fill: "#00d4ff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
