/**
 * Gemini API 호출 로직
 *
 * 기능:
 *  - gemini-2.5-flash 모델 사용
 *  - 30초 타임아웃 처리
 *  - JSON 파싱 실패 시 1회 자동 재시도
 *  - 마크다운 백틱 제거 정규식
 *  - 개발/운영 환경 분기 (localhost = 직접 호출, 운영 = Functions 프록시)
 *  - 시장별 프롬프트 팩토리 (KR/US)
 *  - 워런 버핏 시스템 인스트럭션
 *  - 경제적 해자 심층 서브 프롬프트
 *  - 한국어 응답 강제
 *  - 토큰 최소화 헬퍼
 */

// ─── 모델 & 엔드포인트 ────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-2.5-flash'
const TIMEOUT_MS = 30_000
const IS_DEV = import.meta.env.DEV

// 운영 환경에서 API 키 노출 방지 → Firebase Functions 프록시 사용
const PROXY_URL = 'https://asia-northeast3-moovest.cloudfunctions.net/analyzeStocks'

function getDirectApiUrl() {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) throw new ApiKeyError('VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다')
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`
}

// ─── 커스텀 에러 클래스 ───────────────────────────────────────────────────────
export class ApiKeyError extends Error {
  constructor(msg) {
    super(msg)
    this.name = 'ApiKeyError'
  }
}

export class QuotaExceededError extends Error {
  constructor() {
    super('Gemini API 일일 요청 한도를 초과했습니다. 내일 다시 시도해 주세요.')
    this.name = 'QuotaExceededError'
  }
}

export class TimeoutError extends Error {
  constructor() {
    super(`Gemini API 응답 시간이 ${TIMEOUT_MS / 1000}초를 초과했습니다. 잠시 후 다시 시도해 주세요.`)
    this.name = 'TimeoutError'
  }
}

// ─── 타임아웃 래퍼 ────────────────────────────────────────────────────────────
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new TimeoutError()), ms)
  )
  return Promise.race([promise, timeout])
}

// ─── 안전한 JSON 파싱 (마크다운 백틱 제거 정규식) ──────────────────────────────
function safeParseJson(text) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim()

  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new SyntaxError('유효한 JSON 객체를 찾지 못했습니다')

  return JSON.parse(match[0])
}

// ─── 토큰 최소화 헬퍼 ────────────────────────────────────────────────────────
export function compressStockData(rawData) {
  if (!rawData) return null
  return JSON.stringify(rawData, (k, v) => {
    if (v === null || v === undefined) return undefined
    if (typeof v === 'number') return Math.round(v * 100) / 100
    return v
  })
}

// ─── 뉴스 헤드라인 병합 ───────────────────────────────────────────────────────
export function mergeNewsData(headlines) {
  if (!headlines?.length) return '뉴스 데이터 없음'
  return headlines
    .slice(0, 5)
    .map((h, i) => `${i + 1}. ${h}`)
    .join('\n')
}

// ─── 시스템 인스트럭션 (워런 버핏 스타일) ────────────────────────────────────
const SYSTEM_INSTRUCTION = `당신은 워런 버핏의 가치 투자 철학과 찰리 멍거의 멀티멘탈 모델을 결합한 세계 최고의 장기 투자 분석가입니다.

[핵심 철학]
- "좋은 기업을 좋은 가격에 사는 것이 평범한 기업을 싸게 사는 것보다 훨씬 낫다"
- "당신이 10년 동안 보유하고 싶지 않은 주식은 단 10분도 보유하지 마라"
- 미래 수익의 현재가치(DCF)를 항상 머릿속에 그리며 분석

[분석 원칙]
- 100가지 평가 요소를 6개 카테고리(가치·수익성·성장성·재무건전성·해자·배당)로 통합 평가
- 5~10년 뒤 기업이 더 강해질지 판단 (경쟁 구조, 산업 사이클 고려)
- 정량 데이터 + 정성 판단(브랜드, 경영진 철학)을 균형 있게 반영
- 응답은 반드시 순수 JSON만 출력 (설명 문장 없음)`

// ─── 시장별 프롬프트 팩토리 ────────────────────────────────────────────────────
export function buildPromptByMarket(market, stockData, newsData) {
  const isKR = market === 'KR'
  const marketLabel = isKR ? '한국(KOSPI/KOSDAQ)' : '미국(NYSE/NASDAQ)'
  const currencyNote = isKR ? '금액은 원화(KRW) 기준' : '금액은 달러(USD) 기준'

  const marketSpecific = isKR
    ? `- 코스피/코스닥 상장 종목 중 우량 대형주 위주
- 한국형 지배구조 리스크(오너 리스크) 반드시 고려
- 배당 성향이 낮더라도 FCF 재투자 능력이 우수한 기업 포함 가능
- 공시 기반 자료(DART) 우선 참조`
    : `- S&P500 또는 나스닥100 상장 우량주 위주
- 달러 자산으로서 환율 헤지 효과 고려
- 주주 환원(자사주 매입 + 배당) 역사가 풍부한 기업 우선
- S&P 글로벌 신용등급 A- 이상 기업 우선`

  // 경제적 해자 심층 서브 프롬프트
  const moatSubPrompt = `[경제적 해자 심층 평가 — 필수]
각 기업의 해자 유형을 아래 5가지 중 강한 1~2가지로 분류하고 moat_score(1~10) 및 moat_detail(1~2문장)을 반드시 포함:
1. 브랜드 가치 해자 — 소비자가 프리미엄을 기꺼이 지불하는 브랜드 파워
2. 네트워크 효과 해자 — 사용자 증가 → 서비스 가치 기하급수 증가
3. 원가 우위 해자 — 경쟁사가 따라올 수 없는 규모의 경제 또는 독점 원자재
4. 전환 비용 해자 — 다른 제품으로 전환 시 막대한 비용/불편 발생
5. 규제/특허 해자 — 정부 허가권, 특허, 독점 계약으로 진입 장벽 형성`

  const compressedStock = compressStockData(stockData)
  const newsText = typeof newsData === 'string' ? newsData : mergeNewsData(newsData)

  return `${SYSTEM_INSTRUCTION}

현재 분석 시장: ${marketLabel} | ${currencyNote}

[시장별 선정 기준]
${marketSpecific}

${moatSubPrompt}

[주가/재무 데이터]
${compressedStock ?? '외부 데이터 없음 — AI 자체 지식 기반 분석'}

[최신 뉴스 헤드라인]
${newsText}

[공통 기준]
1. 단기 뉴스(어닝 쇼크, 일시적 테마) 철저 배제
2. 경제적 해자 보유 기업 우선
3. 꾸준한 FCF 창출 및 주주 환원 의지 평가
4. 결정적 선정 요소 정확히 3가지 명시

[출력 언어: 반드시 한국어]
[출력: 아래 JSON 구조만 출력, 다른 텍스트 절대 금지]

{"top5":[{"rank":1,"ticker":"","name":"","moat_type":"","moat_score":0,"long_term_score":0,"key_factors":["","",""],"key_metrics":{"average_roe_10yr":"","fcf_growth":"","debt_risk":"","dividend_growth_years":""},"investment_thesis":"","moat_detail":"","radar":{"value":0,"profitability":0,"growth":0,"financial_health":0,"moat":0,"dividend":0}}]}`
}

// ─── API 호출 (환경별 분기) ───────────────────────────────────────────────────
async function callGeminiApi(market, stockData, newsData, signal) {
  const prompt = buildPromptByMarket(market, stockData, newsData)

  if (IS_DEV) {
    // 개발 환경: 직접 호출
    return fetch(getDirectApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    })
  }

  // 운영 환경: Firebase Functions 프록시 경유
  return fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({ market, stockData, newsData }),
  })
}

// ─── 에러 코드 분류 ────────────────────────────────────────────────────────────
function classifyApiError(status, message) {
  if (status === 429 || message?.includes('RESOURCE_EXHAUSTED')) {
    throw new QuotaExceededError()
  }
  if (status === 401 || status === 403 || message?.includes('API_KEY_INVALID')) {
    throw new ApiKeyError('API 키가 유효하지 않거나 만료되었습니다')
  }
  throw new Error(`Gemini API 오류 (${status}): ${message}`)
}

// ─── 단일 시도 ─────────────────────────────────────────────────────────────────
async function attemptAnalysis(market, stockData, newsData, signal) {
  const response = await callGeminiApi(market, stockData, newsData, signal)

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    classifyApiError(response.status, errData?.error?.message)
  }

  const data = await response.json()

  // Functions 프록시 응답은 { top5: [...] } 직접 반환
  if (Array.isArray(data?.top5)) return data.top5

  // 직접 API 응답 파싱
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini 응답이 비어있습니다')

  const parsed = safeParseJson(text)
  return parsed.top5 ?? []
}

// ─── 메인 함수 (타임아웃 + 1회 재시도) ─────────────────────────────────────────
export async function analyzeStocks(market, stockData, newsData) {
  const controller = new AbortController()

  try {
    return await withTimeout(
      attemptAnalysis(market, stockData, newsData, controller.signal),
      TIMEOUT_MS
    )
  } catch (err) {
    if (
      err instanceof QuotaExceededError ||
      err instanceof ApiKeyError ||
      err instanceof TimeoutError
    ) {
      controller.abort()
      throw err
    }

    // JSON 파싱 실패 등 → 1회 재시도
    console.warn('[Moovest] 1차 시도 실패, 재시도 중...', err.message)
    try {
      return await withTimeout(
        attemptAnalysis(market, stockData, newsData, new AbortController().signal),
        TIMEOUT_MS
      )
    } catch (retryErr) {
      controller.abort()
      throw retryErr
    }
  }
}
