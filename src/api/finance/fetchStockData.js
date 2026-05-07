// Alpha Vantage 기반 재무 데이터 수집
// VITE_ALPHA_VANTAGE_KEY 환경변수 필요 (선택 사항)

const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY

const US_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'BRK-B', 'JNJ', 'JPM', 'V', 'PG']
const KR_TICKERS = ['005930.KS', '000660.KS', '035420.KS', '051910.KS', '006400.KS']

export const fetchTopStocksData = async (market) => {
  const tickers = market === 'KR' ? KR_TICKERS : US_TICKERS

  if (!ALPHA_VANTAGE_KEY) {
    console.info('Alpha Vantage API 키 없음 → Gemini가 기본 지식으로 분석합니다')
    return { market, tickers, note: 'no_external_data' }
  }

  try {
    // 무료 플랜 제한(5 req/min)으로 첫 번째 티커만 샘플 조회
    const ticker = tickers[0]
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`
    const res = await fetch(url)
    const overview = await res.json()

    return { market, tickers, sample_overview: overview }
  } catch (err) {
    console.warn('주가 데이터 수집 실패, Gemini 기본 분석으로 대체:', err.message)
    return { market, tickers }
  }
}
