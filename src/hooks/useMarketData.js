import { useState } from 'react'

export function useMarketData() {
  const [market, setMarket] = useState('US')
  return { market, setMarket }
}
