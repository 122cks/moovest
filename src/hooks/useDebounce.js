import { useCallback, useRef } from 'react'

/**
 * useDebounce 커스텀 훅
 *
 * 사용자가 버튼을 연속으로 클릭해 API 과금이 폭발하는 것을 방지합니다.
 * delay 이내에 재호출하면 이전 호출을 취소하고 마지막 호출만 실행합니다.
 *
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 대기 시간 (ms), 기본 2000ms
 * @returns {{ debouncedFn, isThrottled }}
 */
export function useDebounce(fn, delay = 2000) {
  const timerRef = useRef(null)
  const isThrottledRef = useRef(false)

  const debouncedFn = useCallback(
    (...args) => {
      if (isThrottledRef.current) {
        console.info('[Moovest] 연속 클릭 차단됨 - 잠시 후 다시 시도해 주세요')
        return
      }

      isThrottledRef.current = true

      // delay 경과 후 잠금 해제
      timerRef.current = setTimeout(() => {
        isThrottledRef.current = false
      }, delay)

      return fn(...args)
    },
    [fn, delay]
  )

  return { debouncedFn, isThrottled: isThrottledRef }
}
