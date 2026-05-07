import MarketToggle from "./MarketToggle";
import RefreshButton from "../common/RefreshButton";

export default function Header({
  market,
  onMarketChange,
  onRefresh,
  isLoading,
  onHistoryOpen,
  historyCount,
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-base select-none">
            M
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold text-white">Moovest</h1>
            <p className="text-xs text-slate-500">AI 장기 가치 투자 분석기</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={onHistoryOpen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span>📋</span>
            <span className="hidden sm:inline">과거 기록</span>
            {historyCount > 0 && (
              <span className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">
                {historyCount}
              </span>
            )}
          </button>
          <MarketToggle market={market} onChange={onMarketChange} />
          <RefreshButton onClick={onRefresh} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
}
