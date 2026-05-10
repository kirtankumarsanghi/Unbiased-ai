import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    attribute: string;
    score: number;
  }[];
}

export default function DisparityChart({
  data,
}: Props) {
  return (
    <div className="bg-surface border border-border p-6 h-[400px]">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Demographic Disparity
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#3a4a46" />

          <PolarAngleAxis
            dataKey="attribute"
            stroke="#b9cac4"
          />

          <Radar
            dataKey="score"
            stroke="#00dfc1"
            fill="#00dfc1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}