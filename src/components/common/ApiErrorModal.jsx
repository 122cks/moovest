import { motion, AnimatePresence } from "framer-motion";

/**
 * API 키 만료/무효 시 표시되는 인라인 모달
 * errorType: 'apikey' | 'quota' | 'timeout' | null
 */
export default function ApiErrorModal({
  errorType,
  errorMessage,
  onClose,
  onRetry,
}) {
  const isOpen = errorType === "apikey" || errorType === "quota";
  if (!isOpen) return null;

  const isApiKey = errorType === "apikey";

  const config = {
    apikey: {
      icon: "🔑",
      title: "API 키가 유효하지 않습니다",
      description: "Gemini API 키가 만료되었거나 잘못되었습니다.",
      tip: ".env 파일의 VITE_GEMINI_API_KEY 값을 확인하고\nGoogle AI Studio에서 새 키를 발급받으세요.",
      ctaLabel: "AI Studio 열기",
      ctaHref: "https://aistudio.google.com/app/apikey",
    },
    quota: {
      icon: "⏳",
      title: "일일 요청 한도 초과",
      description: "Gemini 무료 플랜의 일일 요청 한도(1,500회)를 초과했습니다.",
      tip: "내일 자정(UTC) 이후 한도가 초기화됩니다.\n유료 플랜 업그레이드 시 한도가 늘어납니다.",
      ctaLabel: "Gemini 요금제 확인",
      ctaHref: "https://ai.google.dev/pricing",
    },
  };

  const { icon, title, description, tip, ctaLabel, ctaHref } =
    config[errorType] ?? config.apikey;

  return (
    <AnimatePresence>
      <motion.div
        key="api-err-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          key="api-err-modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6"
        >
          <div className="text-center mb-5">
            <div className="text-4xl mb-3">{icon}</div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 mb-5">
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              {tip}
            </p>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400/70 bg-red-500/10 rounded-lg p-2 mb-4 break-words">
              {errorMessage}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm transition-colors"
            >
              닫기
            </button>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium text-center transition-colors"
            >
              {ctaLabel}
            </a>
          </div>

          {onRetry && isApiKey === false && (
            <button
              onClick={onRetry}
              className="w-full mt-2 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              내일 다시 시도
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
