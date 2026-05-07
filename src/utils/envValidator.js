/**
 * 앱 시작 시 필수 환경 변수가 설정되어 있는지 검증합니다.
 * 누락 시 콘솔에 명시적 에러를 출력하고 예외를 던집니다.
 */
const REQUIRED_VARS = [
  { key: 'VITE_GEMINI_API_KEY', label: 'Gemini API 키' },
  { key: 'VITE_FIREBASE_API_KEY', label: 'Firebase API 키' },
]

export function validateEnv() {
  const missing = REQUIRED_VARS.filter(
    ({ key }) => !import.meta.env[key] || import.meta.env[key] === `your_${key.toLowerCase()}_here`
  )

  if (missing.length === 0) return true

  const lines = missing.map(({ key, label }) => `  - ${key} (${label})`)
  const message = `[Moovest] 다음 환경 변수가 설정되지 않았습니다:\n${lines.join('\n')}\n\n.env 파일 또는 GitHub Secrets를 확인하세요.`

  console.error(message)

  // 개발 환경에서는 경고만 (앱 실행은 유지)
  if (import.meta.env.DEV) {
    console.warn('[Moovest] 개발 환경: 환경 변수 없이 실행됩니다. 일부 기능이 동작하지 않을 수 있습니다.')
    return false
  }

  // 운영 환경에서는 에러 throw
  throw new Error(message)
}

/**
 * 특정 환경 변수 하나를 안전하게 가져옵니다.
 * 없으면 null 반환 (에러 없음).
 */
export function getEnv(key) {
  return import.meta.env[key] ?? null
}
