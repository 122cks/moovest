/**
 * 주식 분석 결과를 CSV 파일로 내보내는 유틸리티
 */

const BOM = '\uFEFF' // Excel UTF-8 한글 깨짐 방지

function escapeCsvCell(value) {
  const str = value == null ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildRows(stocks, market) {
  const headers = [
    '순위', '티커', '기업명', '종합점수',
    '성장성', '수익성', '안정성', '가치성', '모멘텀', '해자',
    '현재가', '시가총액', '섹터', '투자논거',
  ]

  const rows = stocks.map((s, i) => [
    i + 1,
    s.ticker ?? '',
    s.company_name ?? '',
    s.total_score ?? '',
    s.scores?.growth ?? '',
    s.scores?.profitability ?? '',
    s.scores?.stability ?? '',
    s.scores?.valuation ?? '',
    s.scores?.momentum ?? '',
    s.scores?.moat ?? '',
    s.current_price ?? '',
    s.market_cap ?? '',
    s.sector ?? '',
    (s.investment_thesis ?? '').replace(/\n/g, ' '),
  ])

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n')
}

/**
 * @param {Array} stocks  - 분석 결과 배열
 * @param {string} market - 'KR' | 'US'
 * @param {string} [filename]
 */
export function exportToCSV(stocks, market = 'KR', filename) {
  const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const defaultName = `moovest_${market.toLowerCase()}_top5_${date}.csv`
  const csvContent = BOM + buildRows(stocks, market)

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? defaultName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
