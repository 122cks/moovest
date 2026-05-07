import { motion, AnimatePresence } from "framer-motion";

export default function HistorySidebar({ isOpen, onClose, history, onSelect }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar Panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white">📋 분석 기록</h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {history.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-600 text-sm">
                    아직 분석 기록이 없습니다
                  </p>
                  <p className="text-slate-700 text-xs mt-2">
                    AI 갱신 버튼을 누르면 자동 저장됩니다
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const date = item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleDateString("ko-KR")
                    : "날짜 없음";
                  const topName = item.top5?.[0]?.name ?? "—";

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="w-full text-left bg-slate-800/60 hover:bg-slate-800 rounded-xl p-4 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-emerald-400">
                          제 {item.episode}회
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.market === "KR"
                              ? "bg-blue-500/15 text-blue-400"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {item.market === "KR" ? "🇰🇷 한국" : "🇺🇸 미국"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{date}</p>
                      <p className="text-xs text-slate-600 mt-1 truncate group-hover:text-slate-400 transition-colors">
                        1위: {topName}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
