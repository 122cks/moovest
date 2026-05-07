import { motion } from "framer-motion";

export default function RefreshButton({ onClick, isLoading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileTap={isLoading ? {} : { scale: 0.97 }}
      className={`
        relative flex items-center gap-3 px-6 py-2.5 rounded-xl font-semibold text-sm
        transition-all duration-200 select-none
        ${
          isLoading
            ? "bg-emerald-500/15 text-emerald-400 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
        }
      `}
    >
      <motion.span
        animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}
        }
        className="text-base leading-none"
      >
        🔄
      </motion.span>
      <span>
        {isLoading ? "AI가 100가지 요소를 분석 중..." : "실시간 AI 갱신"}
      </span>
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-emerald-500/40"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
