/**
 * Firebase Cloud Functions — Gemini API 프록시 서버
 *
 * 브라우저에서 API 키가 노출되지 않도록 서버 측에서 Gemini를 호출합니다.
 * 프론트엔드: IS_PROD 환경에서 이 엔드포인트로 요청을 보냅니다.
 *
 * 배포: firebase deploy --only functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const admin = require('firebase-admin')

admin.initializeApp()

// Cloud Functions 시크릿 (firebase functions:secrets:set GEMINI_API_KEY)
const GEMINI_SECRET = defineSecret('GEMINI_API_KEY')

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const TIMEOUT_MS = 55_000 // Cloud Functions 기본 타임아웃 60초보다 여유롭게

// ── 허용 출처 (CORS) ────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://moovest.web.app',
  'https://moovest.firebaseapp.com',
  // 로컬 개발용 — 운영 배포 시 제거 권장
  'http://localhost:5173',
]

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.set('Access-Control-Max-Age', '3600')
}

// ── 입력 검증 ───────────────────────────────────────────────────────────────
function validateBody(body) {
  const { market, stockData } = body ?? {}
  if (!market || !['KR', 'US'].includes(market)) {
    return '유효하지 않은 시장 코드 (KR 또는 US)'
  }
  if (!stockData || typeof stockData !== 'object') {
    return '주가 데이터(stockData)가 누락되었습니다'
  }
  return null
}

// ── Gemini 호출 ─────────────────────────────────────────────────────────────
async function callGemini(apiKey, prompt) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await response.text()
      throw Object.assign(new Error(body), { status: response.status })
    }

    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

// ── 프롬프트 빌더 ───────────────────────────────────────────────────────────
function buildPrompt(market, stockData, newsData) {
  const newsText = Array.isArray(newsData) && newsData.length
    ? newsData.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')
    : '뉴스 데이터 없음'

  const ticker = market === 'KR' ? '코스피/코스닥' : 'NYSE/NASDAQ'

  return `당신은 워런 버핏과 찰리 멍거의 가치투자 철학을 따르는 AI 주식 분석가입니다.

아래 ${ticker} 주식 데이터와 뉴스를 분석하여 TOP 5 종목을 선정해 주세요.

[주식 데이터]
${JSON.stringify(stockData, null, 2)}

[최근 뉴스]
${newsText}

[평가 기준] (각 0~100점, 가중 합산)
- 성장성(25%): 매출/이익 성장률, TAM 규모, 신규 시장 진입
- 수익성(25%): ROE, ROA, FCF 마진, EBITDA
- 안정성(20%): 부채비율, 유동비율, 신용등급
- 가치성(15%): PER, PBR, EV/EBITDA 벨류에이션
- 모멘텀(10%): 최근 6개월 주가 추세, 거래량
- 경제적 해자(5%): 브랜드, 특허, 네트워크 효과, 원가 우위

반드시 아래 JSON 형식으로만 응답하세요:
{
  "top5": [
    {
      "rank": 1,
      "ticker": "티커",
      "company_name": "기업명(한국어)",
      "total_score": 87,
      "scores": {
        "growth": 90, "profitability": 85, "stability": 80,
        "valuation": 82, "momentum": 88, "moat": 92
      },
      "current_price": "가격(원/$)",
      "market_cap": "시가총액",
      "sector": "섹터",
      "moat_description": "경제적 해자 한줄 설명",
      "key_factors": ["핵심 이유1", "핵심 이유2", "핵심 이유3"],
      "investment_thesis": "200자 이내 투자 논거 (한국어)",
      "risk_factors": ["리스크1", "리스크2"]
    }
  ],
  "analysis_date": "${new Date().toISOString().slice(0, 10)}",
  "market": "${market}"
}
`
}

// ── 메인 Cloud Function ─────────────────────────────────────────────────────
exports.analyzeStocks = onRequest(
  { secrets: [GEMINI_SECRET], timeoutSeconds: 60, memory: '256MiB', region: 'asia-northeast3' },
  async (req, res) => {
    setCorsHeaders(req, res)

    // Preflight
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'POST 메서드만 허용됩니다' })
      return
    }

    const validationError = validateBody(req.body)
    if (validationError) {
      res.status(400).json({ error: validationError })
      return
    }

    const { market, stockData, newsData } = req.body

    try {
      const apiKey = GEMINI_SECRET.value()
      const prompt = buildPrompt(market, stockData, newsData)
      const geminiResponse = await callGemini(apiKey, prompt)

      const rawText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

      // JSON 추출
      const match = rawText.match(/\{[\s\S]*\}/)
      if (!match) {
        throw new Error('Gemini 응답에서 JSON을 파싱할 수 없습니다')
      }

      const parsed = JSON.parse(match[0])
      res.status(200).json(parsed)
    } catch (err) {
      console.error('[analyzeStocks] Gemini 호출 오류:', err)

      if (err.status === 429) {
        res.status(429).json({ error: 'QUOTA_EXCEEDED', message: err.message })
      } else if (err.status === 401 || err.status === 403) {
        res.status(403).json({ error: 'API_KEY_INVALID', message: err.message })
      } else if (err.name === 'AbortError') {
        res.status(504).json({ error: 'TIMEOUT', message: '분석 시간이 초과되었습니다' })
      } else {
        res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message })
      }
    }
  }
)

// ── 주간 자동 분석 스케줄러 (매주 월요일 오전 9시 KST) ─────────────────────
const { onSchedule } = require('firebase-functions/v2/scheduler')
const { getFirestore } = require('firebase-admin/firestore')

exports.weeklyAnalysis = onSchedule(
  {
    schedule: '0 0 * * 1', // UTC 00:00 = KST 09:00
    timeZone: 'Asia/Seoul',
    secrets: [GEMINI_SECRET],
    timeoutSeconds: 120,
    memory: '512MiB',
    region: 'asia-northeast3',
  },
  async (_event) => {
    const db = getFirestore()
    const apiKey = GEMINI_SECRET.value()

    for (const market of ['KR', 'US']) {
      try {
        const prompt = buildPrompt(market, { auto: true }, [])
        const geminiResponse = await callGemini(apiKey, prompt)
        const rawText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const match = rawText.match(/\{[\s\S]*\}/)
        if (!match) continue

        const result = JSON.parse(match[0])
        await db.collection('rankings').add({
          market,
          top5: result.top5,
          createdAt: new Date().toISOString(),
          type: 'weekly_auto',
        })
        console.log(`[weeklyAnalysis] ${market} 분석 저장 완료`)
      } catch (err) {
        console.error(`[weeklyAnalysis] ${market} 분석 실패:`, err.message)
      }
    }
  }
)
