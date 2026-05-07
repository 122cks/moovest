import { motion, AnimatePresence } from "framer-motion";

/**
 * AI 분석 진행률 가짜 프로그레스 바
 * progress: 0~100 숫자값을 받아 Tailwind로 시각화
 */
export default function ProgressBar({ progress, isVisible }) {
  const messages = [
    "재무 데이터 수집 중...",
    "100가지 평가 요소 분석 중...",
    "경제적 해자 심층 평가 중...",
    "워런 버핏 기준 적용 중...",
    "TOP 5 선정 마무리 중...",
    "분석 결과 정리 중...",
  ];

  const msgIndex = Math.min(
    Math.floor((progress / 100) * messages.length),
    messages.length - 1,
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="w-full px-4 sm:px-6 py-3 bg-slate-900/90 border-b border-slate-800"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-slate-400 animate-pulse">
                {messages[msgIndex]}
              </p>
              <p className="text-xs font-mono text-emerald-400">{progress}%</p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
