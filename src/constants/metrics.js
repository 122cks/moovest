// 6대 평가 카테고리 (레이더 차트 축과 일치)
export const EVALUATION_CATEGORIES = [
  { id: 'value', label: '가치 지표', color: 'blue' },
  { id: 'profitability', label: '수익성 지표', color: 'green' },
  { id: 'growth', label: '성장성 지표', color: 'purple' },
  { id: 'financial_health', label: '재무 건전성', color: 'yellow' },
  { id: 'moat', label: '경제적 해자', color: 'red' },
  { id: 'dividend', label: '주주 환원', color: 'orange' },
]

// 100가지 평가 요소 (주요 항목)
export const EVALUATION_METRICS = [
  // 가치 지표
  { id: 'per', label: 'PER (주가수익비율)', category: 'value' },
  { id: 'pbr', label: 'PBR (주가순자산비율)', category: 'value' },
  { id: 'psr', label: 'PSR (주가매출비율)', category: 'value' },
  { id: 'pcr', label: 'PCR (주가현금흐름비율)', category: 'value' },
  { id: 'ev_ebitda', label: 'EV/EBITDA', category: 'value' },
  { id: 'peg', label: 'PEG (성장대비 PER)', category: 'value' },

  // 수익성 지표
  { id: 'roe', label: 'ROE (자기자본이익률)', category: 'profitability' },
  { id: 'roa', label: 'ROA (총자산이익률)', category: 'profitability' },
  { id: 'roic', label: 'ROIC (투하자본이익률)', category: 'profitability' },
  { id: 'gross_margin', label: '매출총이익률', category: 'profitability' },
  { id: 'operating_margin', label: '영업이익률', category: 'profitability' },
  { id: 'net_margin', label: '순이익률', category: 'profitability' },
  { id: 'ebitda_margin', label: 'EBITDA 마진', category: 'profitability' },

  // 성장성 지표
  { id: 'revenue_growth_5yr', label: '5년 매출 성장률', category: 'growth' },
  { id: 'eps_growth_5yr', label: '5년 EPS 성장률', category: 'growth' },
  { id: 'fcf_growth_5yr', label: '5년 FCF 성장률', category: 'growth' },
  { id: 'bvps_growth_5yr', label: '5년 BPS 성장률', category: 'growth' },

  // 재무 건전성
  { id: 'debt_to_equity', label: '부채비율 (D/E)', category: 'financial_health' },
  { id: 'current_ratio', label: '유동비율', category: 'financial_health' },
  { id: 'quick_ratio', label: '당좌비율', category: 'financial_health' },
  { id: 'interest_coverage', label: '이자보상비율', category: 'financial_health' },
  { id: 'altman_z', label: 'Altman Z-Score (파산 위험)', category: 'financial_health' },

  // 경제적 해자
  { id: 'brand_moat', label: '브랜드 가치 해자', category: 'moat' },
  { id: 'network_moat', label: '네트워크 효과 해자', category: 'moat' },
  { id: 'cost_moat', label: '원가 우위 해자', category: 'moat' },
  { id: 'switching_moat', label: '전환 비용 해자', category: 'moat' },
  { id: 'regulation_moat', label: '규제/특허 해자', category: 'moat' },

  // 주주 환원
  { id: 'dividend_yield', label: '배당 수익률', category: 'dividend' },
  { id: 'dividend_growth_years', label: '배당 성장 연수', category: 'dividend' },
  { id: 'payout_ratio', label: '배당 성향', category: 'dividend' },
  { id: 'buyback_ratio', label: '자사주 매입 비율', category: 'dividend' },
]

// 기본 분석 대상 티커 목록
export const TOP_TICKERS = {
  US: [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA',
    'BRK-B', 'JNJ', 'JPM', 'V', 'PG',
    'KO', 'WMT', 'HD', 'MA', 'UNH',
  ],
  KR: [
    '005930', // 삼성전자
    '000660', // SK하이닉스
    '035420', // NAVER
    '051910', // LG화학
    '006400', // 삼성SDI
    '035720', // 카카오
    '068270', // 셀트리온
    '105560', // KB금융
  ],
}
