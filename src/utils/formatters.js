export function formatCurrency(num, currency = 'USD') {
  if (num == null || isNaN(num)) return '-'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatNumber(num) {
  if (num == null || isNaN(num)) return '-'
  return new Intl.NumberFormat('ko-KR').format(num)
}

export function formatPercent(num) {
  if (num == null || isNaN(num)) return '-'
  const sign = num > 0 ? '+' : ''
  return `${sign}${Number(num).toFixed(2)}%`
}

export function formatDate(date) {
  if (!date) return '-'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
