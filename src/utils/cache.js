// ─── 로컬 스토리지 캐시 (1시간) ─────────────────────────────────────────────
const CACHE_TTL_MS = 60 * 60 * 1000 // 1시간

export function getCachedAnalysis(market) {
  try {
    const raw = localStorage.getItem(`moovest_analysis_${market}`)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`moovest_analysis_${market}`)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function setCachedAnalysis(market, data) {
  try {
    localStorage.setItem(
      `moovest_analysis_${market}`,
      JSON.stringify({ data, timestamp: Date.now() })
    )
  } catch {
    // localStorage 용량 초과 무시
  }
}

export function clearAnalysisCache(market) {
  localStorage.removeItem(`moovest_analysis_${market}`)
}
