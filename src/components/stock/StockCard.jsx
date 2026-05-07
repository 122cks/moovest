import { motion } from "framer-motion";
import Badge from "../common/Badge";

const MOAT_VARIANT = {
  "강력한 생태계": "purple",
  "브랜드 가치": "blue",
  "원가 우위": "yellow",
  "전환 비용": "green",
  "네트워크 효과": "orange",
};

const METRIC_LABELS = {
  average_roe_10yr: "10년 평균 ROE",
  fcf_growth: "FCF 성장",
  debt_risk: "부채 위험도",
  dividend_growth_years: "배당 성장",
};

function scoreColor(score) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-blue-400";
  return "text-amber-400";
}

export default function StockCard({ stock, index, onClick }) {
  const color = scoreColor(stock.long_term_score);
  const moatVariant =
    Object.entries(MOAT_VARIANT).find(([k]) =>
      stock.moat_type?.includes(k),
    )?.[1] ?? "green";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => onClick(stock)}
      className="group bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/50 hover:border-emerald-500/30 rounded-2xl p-5 cursor-pointer transition-all duration-200"
    >
      {/* Header: rank + name + score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-slate-700 leading-none">
            #{stock.rank}
          </span>
          <div>
            <p className="text-lg font-bold text-white leading-tight">
              {stock.name}
            </p>
            <p className="text-sm text-slate-400 font-mono mt-0.5">
              {stock.ticker}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-3xl font-black leading-none ${color}`}>
            {stock.long_term_score}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">/ 100점</p>
        </div>
      </div>

      {/* Moat Badge */}
      {stock.moat_type && (
        <div className="mb-3">
          <Badge variant={moatVariant}>🏰 {stock.moat_type}</Badge>
        </div>
      )}

      {/* Key Metrics */}
      {stock.key_metrics && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(stock.key_metrics).map(([k, v]) => (
            <div key={k} className="bg-slate-950/60 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">
                {METRIC_LABELS[k] || k}
              </p>
              <p className="text-sm font-semibold text-slate-200">{v}</p>
            </div>
          ))}
        </div>
      )}

      {/* Key Factors */}
      {stock.key_factors?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {stock.key_factors.map((f) => (
            <Badge key={f} variant="blue">
              {f}
            </Badge>
          ))}
        </div>
      )}

      {/* Thesis */}
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
        {stock.investment_thesis}
      </p>

      <p className="mt-3 text-xs text-slate-600 group-hover:text-emerald-500 transition-colors">
        클릭하여 상세 분석 보기 →
      </p>
    </motion.div>
  );
}
