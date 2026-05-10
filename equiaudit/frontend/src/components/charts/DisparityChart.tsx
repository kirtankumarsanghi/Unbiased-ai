import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  PolarRadiusAxis,
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
    <div className="bg-surface border border-border p-6 h-[400px] shadow-[0_0_0_1px_rgba(255,170,0,0.08),0_18px_40px_rgba(0,0,0,0.28)]">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Demographic Disparity
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#3a4a46" />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 1]}
            tick={false}
          />

          <PolarAngleAxis
            dataKey="attribute"
            stroke="#b9cac4"
          />

          <Radar
            dataKey="score"
            stroke="#ffaa00"
            fill="#ffaa00"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
