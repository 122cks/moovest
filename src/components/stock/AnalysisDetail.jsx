import { motion, AnimatePresence } from "framer-motion";
import RadarChart from "./RadarChart";
import Badge from "../common/Badge";

const METRIC_LABELS = {
  average_roe_10yr: "10년 평균 ROE",
  fcf_growth: "FCF 성장성",
  debt_risk: "부채 위험도",
  dividend_growth_years: "배당 성장 연수",
};

export default function AnalysisDetail({ stock, onClose, onBlogExport }) {
  if (!stock) return null;

  const scoreColor =
    stock.long_term_score >= 90
      ? "text-emerald-400"
      : stock.long_term_score >= 75
        ? "text-blue-400"
        : "text-amber-400";

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">
                  #{stock.rank} 선정 종목
                </p>
                <h2 className="text-2xl font-bold text-white">{stock.name}</h2>
                <p className="text-slate-400 font-mono text-sm mt-0.5">
                  {stock.ticker}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors text-2xl leading-none mt-1"
              >
                ×
              </button>
            </div>

            {/* Score Banner */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 mb-6 text-center">
              <p className={`text-5xl font-black ${scoreColor}`}>
                {stock.long_term_score}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                장기 투자 종합 점수 / 100점
              </p>
            </div>

            {/* Radar Chart */}
            {stock.radar && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  6대 핵심 지표 레이더 차트
                </h3>
                <div className="bg-slate-800/30 rounded-xl p-2">
                  <RadarChart data={stock.radar} />
                </div>
              </div>
            )}

            {/* Investment Thesis */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                투자 핵심 논거
              </h3>
              <p className="text-slate-200 leading-relaxed bg-slate-800/50 rounded-xl p-4 text-sm">
                {stock.investment_thesis}
              </p>
            </div>

            {/* Key Factors */}
            {stock.key_factors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  결정적 선정 요인 TOP 3
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stock.key_factors.map((f) => (
                    <Badge key={f} variant="blue">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics */}
            {stock.key_metrics && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  핵심 재무 지표
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(stock.key_metrics).map(([k, v]) => (
                    <div key={k} className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">
                        {METRIC_LABELS[k] || k}
                      </p>
                      <p className="text-base font-bold text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                닫기
              </button>
              {onBlogExport && (
                <button
                  onClick={() => onBlogExport(stock)}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors text-sm font-medium"
                >
                  📝 블로그 초안 생성
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
