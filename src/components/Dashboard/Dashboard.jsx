import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StockList from "../stock/StockList";
import AnalysisDetail from "../stock/AnalysisDetail";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import { formatBlogPost } from "../../utils/blogFormatter";

export default function Dashboard({
  stocks,
  isLoading,
  error,
  market,
  episode,
  onRetry,
}) {
  const [selectedStock, setSelectedStock] = useState(null);

  const handleBlogExport = (stock) => {
    const content = formatBlogPost(stock, market, episode);
    navigator.clipboard
      .writeText(content)
      .then(() => alert("블로그 초안이 클립보드에 복사되었습니다! 🎉"))
      .catch(() =>
        alert("클립보드 복사에 실패했습니다. 수동으로 복사해 주세요."),
      );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1">
      {/* Episode Banner */}
      <AnimatePresence mode="wait">
        {episode > 0 && !isLoading && (
          <motion.div
            key={episode}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-2 flex-wrap"
          >
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-sm font-semibold">
              제 {episode}회 분석
            </span>
            <span className="text-slate-500 text-sm">
              {market === "KR" ? "한국 주식" : "미국 주식"} TOP 5
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && !isLoading && (
        <div className="mb-6">
          <ErrorAlert message={error} onRetry={onRetry} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-40">
          <LoadingSpinner
            size="lg"
            text="10년치 재무 데이터 및 100가지 요소를 분석 중..."
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && stocks.length === 0 && (
        <div className="text-center py-40">
          <div className="text-6xl mb-5">📊</div>
          <p className="text-xl font-semibold text-slate-300 mb-2">
            분석 결과가 없습니다
          </p>
          <p className="text-sm text-slate-500">
            상단의{" "}
            <span className="text-emerald-400 font-medium">
              "실시간 AI 갱신"
            </span>{" "}
            버튼을 눌러 AI 분석을 시작하세요
          </p>
        </div>
      )}

      {/* Stock Cards */}
      {!isLoading && stocks.length > 0 && (
        <StockList stocks={stocks} onCardClick={setSelectedStock} />
      )}

      {/* Detail Modal */}
      {selectedStock && (
        <AnalysisDetail
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onBlogExport={handleBlogExport}
        />
      )}
    </main>
  );
}
