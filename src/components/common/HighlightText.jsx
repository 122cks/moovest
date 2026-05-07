/**
 * 투자 논거(investment_thesis) 텍스트에서 특정 키워드를 형광펜 효과로 하이라이트합니다.
 */

const KEYWORDS = [
  "배당",
  "해자",
  "AI",
  "독점",
  "FCF",
  "ROE",
  "성장",
  "브랜드",
  "현금흐름",
  "수익성",
  "안정성",
  "메가트렌드",
  "특허",
  "독점기업",
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function HighlightText({ text }) {
  if (!text) return null;

  const pattern = new RegExp(`(${KEYWORDS.map(escapeRegex).join("|")})`, "g");
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, i) =>
        KEYWORDS.includes(part) ? (
          <mark
            key={i}
            className="bg-emerald-500/20 text-emerald-300 rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
