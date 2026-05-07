/**
 * 로거 유틸리티
 * - 개발 환경: 콘솔에 레벨별 색상 출력
 * - 운영 환경: console.log/debug 자동 억제, warn/error만 출력
 */

const IS_PROD = import.meta.env.PROD
const PREFIX = '[Moovest]'

export const logger = {
  info: (...args) => {
    if (!IS_PROD) console.info(`%c${PREFIX}`, 'color:#10b981;font-weight:bold', ...args)
  },
  warn: (...args) => {
    console.warn(`%c${PREFIX}`, 'color:#f59e0b;font-weight:bold', ...args)
  },
  error: (...args) => {
    console.error(`%c${PREFIX}`, 'color:#ef4444;font-weight:bold', ...args)
  },
  debug: (...args) => {
    if (!IS_PROD) console.debug(`%c${PREFIX}`, 'color:#94a3b8', ...args)
  },
  group: (label, fn) => {
    if (IS_PROD) return fn()
    console.group(`${PREFIX} ${label}`)
    fn()
    console.groupEnd()
  },
}
