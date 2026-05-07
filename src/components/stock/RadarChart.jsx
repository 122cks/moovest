import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const AXIS_LABELS = {
  value: "가치",
  profitability: "수익성",
  growth: "성장성",
  financial_health: "재무",
  moat: "해자",
  dividend: "배당",
};

export default function RadarChart({ data }) {
  if (!data) return null;

  const chartData = Object.entries(data).map(([key, val]) => ({
    subject: AXIS_LABELS[key] || key,
    score: typeof val === "number" ? val : 0,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReRadarChart
        data={chartData}
        margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
      >
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "Inter" }}
        />
        <Radar
          name="점수"
          dataKey="score"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "13px",
          }}
          formatter={(v) => [`${v}점`, "점수"]}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
