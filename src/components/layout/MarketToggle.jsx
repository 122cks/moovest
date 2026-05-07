export default function MarketToggle({ market, onChange }) {
  return (
    <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
      {["KR", "US"].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            market === m
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {m === "KR" ? "🇰🇷 한국" : "🇺🇸 미국"}
        </button>
      ))}
    </div>
  );
}
