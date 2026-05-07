import { useApp } from "../../store/AppContext";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
      style={{ background: isDark ? "#10b981" : "#475569" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center text-xs"
        style={{ transform: isDark ? "translateX(24px)" : "translateX(0)" }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
