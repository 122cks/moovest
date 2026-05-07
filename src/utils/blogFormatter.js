/**
 * 선정된 종목 1개를 블로그 포스팅 초안 텍스트로 변환합니다.
 * Dashboard의 "블로그 초안 생성" 버튼에서 호출됩니다.
 */
export function formatBlogPost(stock, market, episode) {
  const marketLabel = market === 'KR' ? '한국' : '미국'
  const date = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const metricLines = stock.key_metrics
    ? Object.entries(stock.key_metrics)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n')
    : ''

  const factorLines = stock.key_factors
    ? stock.key_factors.map((f) => `• ${f}`).join('\n')
    : ''

  return `[제 ${episode}회 AI 장기 투자 분석] ${marketLabel} 주식 TOP 5 — ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 ${stock.rank}위 | ${stock.name} (${stock.ticker})

■ 종합 점수: ${stock.long_term_score}점 / 100점
■ 경제적 해자: ${stock.moat_type}

▶ AI 투자 핵심 논거
${stock.investment_thesis}

▶ 핵심 재무 지표
${metricLines}

▶ 선정 결정 요인
${factorLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 본 분석은 AI가 생성한 정보로 투자 권유가 아닙니다.
   투자는 본인의 판단과 책임 하에 진행하시기 바랍니다.

#장기투자 #가치투자 #${stock.ticker} #AI투자분석 #${marketLabel}주식 #Moovest`
}
