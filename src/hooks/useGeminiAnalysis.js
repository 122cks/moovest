import { useState, useCallback, useRef } from 'react'
import { analyzeStocks, ApiKeyError, QuotaExceededError, TimeoutError } from '../api/gemini/analyzeStock'
import { fetchTopStocksData } from '../api/finance/fetchStockData'
import { saveRankingToFirebase } from '../api/firebase/saveAnalysis'
import { getCachedAnalysis, setCachedAnalysis } from '../utils/cache'
import { logger } from '../utils/logger'

// 연속 클릭 방지 쿨다운 (ms)
const DEBOUNCE_MS = 3000

export function useGeminiAnalysis() {
  const [topStocks, setTopStocks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorType, setErrorType] = useState(null) // 'quota' | 'apikey' | 'timeout' | 'general'
  const [episode, setEpisode] = useState(0)
  const [progress, setProgress] = useState(0) // 0~100 가짜 진행률

  // 디바운싱: 마지막 호출 타임스탬프
  const lastCallRef = useRef(0)
  const progressTimerRef = useRef(null)

  // ── 가짜 프로그레스 바 시뮬레이션 ──────────────────────────────────────────
  const startProgress = useCallback(() => {
    setProgress(0)
    const steps = [
      { pct: 10, delay: 200 },
      { pct: 25, delay: 600 },
      { pct: 45, delay: 1200 },
      { pct: 65, delay: 2500 },
      { pct: 80, delay: 4000 },
      { pct: 90, delay: 7000 },
    ]
    steps.forEach(({ pct, delay }) => {
      progressTimerRef.current = setTimeout(() => setProgress(pct), delay)
    })
  }, [])

  const finishProgress = useCallback(() => {
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
    setProgress(100)
    setTimeout(() => setProgress(0), 600)
  }, [])

  // ── 메인 분석 실행 ──────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async (market) => {
    // 디바운싱: 3초 이내 재호출 차단
    const now = Date.now()
    if (now - lastCallRef.current < DEBOUNCE_MS) {
      logger.warn('연속 호출 차단 - 잠시 후 다시 시도해 주세요')
      return
    }
    lastCallRef.current = now

    // 캐시 확인 (1시간 이내 동일 시장 결과 재사용)
    const cached = getCachedAnalysis(market)
    if (cached) {
      logger.info(`캐시된 분석 결과 사용 (${market})`)
      setTopStocks(cached.top5 || cached)
      setEpisode(cached.episode || 0)
      return
    }

    setIsLoading(true)
    setError(null)
    setErrorType(null)
    startProgress()

    try {
      // Step 1: 주가/재무 데이터 수집
      const stockData = await fetchTopStocksData(market)

      // Step 2: Gemini AI 분석
      const results = await analyzeStocks(market, stockData, null)
      setTopStocks(results)

      // Step 3: Firebase 저장
      let savedEpisode = 0
      try {
        savedEpisode = await saveRankingToFirebase(market, results)
        setEpisode(savedEpisode)
      } catch (fbErr) {
        logger.warn('Firebase 저장 실패 (UI에는 영향 없음)', fbErr.message)
      }

      // Step 4: 캐시 저장
      setCachedAnalysis(market, { top5: results, episode: savedEpisode })
      logger.info(`분석 완료 - ${market} 시장 TOP 5`)
    } catch (err) {
      logger.error('분석 실패', err)

      if (err instanceof QuotaExceededError) {
        setErrorType('quota')
      } else if (err instanceof ApiKeyError) {
        setErrorType('apikey')
      } else if (err instanceof TimeoutError) {
        setErrorType('timeout')
      } else {
        setErrorType('general')
      }

      setError(err.message || '알 수 없는 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
      finishProgress()
    }
  }, [startProgress, finishProgress])

  return {
    topStocks,
    isLoading,
    error,
    errorType,
    episode,
    progress,
    runAnalysis,
    setTopStocks,
    setEpisode,
  }
}
