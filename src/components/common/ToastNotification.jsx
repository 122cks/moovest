import { motion, AnimatePresence } from "framer-motion";

/**
 * 오프라인 감지 토스트 + 타임아웃 경고 토스트
 */
export default function ToastNotification({ isOnline, errorType, onDismiss }) {
  const toasts = [];

  if (!isOnline) {
    toasts.push({
      id: "offline",
      icon: "📡",
      message: "오프라인 상태입니다. 인터넷 연결을 확인해 주세요.",
      color: "amber",
    });
  }

  if (errorType === "timeout") {
    toasts.push({
      id: "timeout",
      icon: "⏱️",
      message:
        "AI 분석 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.",
      color: "red",
    });
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
              ${
                t.color === "amber"
                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                  : "bg-red-500/15 border border-red-500/30 text-red-300"
              }`}
          >
            <span>{t.icon}</span>
            <span>{t.message}</span>
            {onDismiss && (
              <button
                onClick={() => onDismiss(t.id)}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
