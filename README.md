# 📊 Moovest — AI 주식 분석 플랫폼

워런 버핏과 찰리 멍거의 가치투자 철학을 기반으로,  
**Gemini 2.0 Flash AI**가 100가지 평가 기준으로 한국/미국 주식 TOP 5를 선정합니다.

[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-orange)](https://moovest.web.app)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-blue)](https://ai.google.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF)](https://vitejs.dev)

---

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 🤖 AI 주식 분석 | Gemini 2.0 Flash가 100개 지표로 TOP 5 선정 |
| 🏰 경제적 해자 평가 | 브랜드/특허/네트워크 효과/원가 우위 판별 |
| 🌐 한국·미국 시장 | KR(코스피/코스닥) / US(NYSE/NASDAQ) 지원 |
| ⚡ 1시간 캐싱 | 동일 시장 재분석 시 로컬 캐시 활용 (API 비용 절감) |
| 🔒 서버 프록시 | Firebase Cloud Functions로 API 키 브라우저 노출 차단 |
| 📱 숏폼 대본 | 60초 숏폼 영상 대본 원클릭 생성/복사 |
| 📥 CSV 내보내기 | TOP 5 분석 결과 엑셀 다운로드 |
| 🌙 다크/라이트 모드 | OS 설정 자동 반영 + 수동 전환 |
| 🔔 오프라인 감지 | 네트워크 끊김 시 토스트 경고 |
| 📅 주간 자동 분석 | 매주 월요일 오전 9시(KST) Firebase에 자동 저장 |

---

## 🛠 기술 스택

```
Frontend      React 18 + Vite 5 + Tailwind CSS v3
Animation     Framer Motion
Charts        Recharts (레이더 차트)
AI            Google Gemini 2.0 Flash
Database      Firebase Firestore
Hosting       Firebase Hosting
Functions     Firebase Cloud Functions v2 (Node 20)
CI/CD         GitHub Actions → Firebase Hosting 자동 배포
```

---

## ⚡ 로컬 개발 시작

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/moovest.git
cd moovest
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 아래 값을 채웁니다:

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `VITE_GEMINI_API_KEY` | Gemini API 키 | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_FIREBASE_API_KEY` | Firebase Web API 키 | Firebase Console → 프로젝트 설정 |

```env
VITE_GEMINI_API_KEY=AIza...
VITE_FIREBASE_API_KEY=AIza...
```

> ⚠️ `.env` 파일은 **절대 Git에 커밋하지 마세요.** `.gitignore`에 포함되어 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
# http://localhost:5173 에서 확인
```

---

## 🏗 프로젝트 구조

```
src/
├── api/
│   ├── gemini/
│   │   └── analyzeStock.js   # Gemini API 호출 (타임아웃, 재시도, 캐싱)
│   ├── finance/
│   │   └── fetchStockData.js # 주가/재무 데이터 수집
│   └── firebase/
│       ├── config.js         # Firebase 초기화
│       ├── saveAnalysis.js   # Firestore 저장
│       └── fetchHistory.js   # 과거 분석 불러오기
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.jsx # API 에러 전역 처리
│   │   ├── ProgressBar.jsx   # 분석 진행률 표시
│   │   ├── ApiErrorModal.jsx # Quota/키 에러 모달
│   │   ├── ToastNotification.jsx # 오프라인/타임아웃 토스트
│   │   ├── DarkModeToggle.jsx
│   │   └── HighlightText.jsx # 키워드 하이라이트
│   ├── layout/               # Header, Footer
│   ├── Dashboard/            # 메인 대시보드
│   ├── stock/                # StockCard, StockDetail
│   └── history/              # 분석 히스토리 사이드바
├── hooks/
│   ├── useGeminiAnalysis.js  # 분석 오케스트레이션 (캐싱+디바운싱)
│   ├── useMarketData.js      # KR/US 시장 선택
│   ├── useDebounce.js        # 연속 클릭 방지 (3초)
│   └── useOnlineStatus.js    # 네트워크 상태 감지
├── store/
│   └── AppContext.jsx        # 전역 상태 (다크모드, 사이드바)
└── utils/
    ├── cache.js              # 1시간 로컬스토리지 캐싱
    ├── envValidator.js       # 환경변수 검증
    ├── logger.js             # 개발/운영 로거
    ├── csvExporter.js        # CSV 다운로드
    ├── shortformFormatter.js # 숏폼 대본 생성
    └── blogFormatter.js      # 블로그 초안 생성

functions/
├── index.js                  # Cloud Functions (프록시 + 주간 스케줄러)
└── package.json
```

---

## ☁️ Firebase 배포

### Firebase CLI 초기 설정 (최초 1회)

```bash
npm install -g firebase-tools
firebase login
firebase use moovest
```

### Gemini API 키를 Cloud Functions 시크릿으로 등록

```bash
firebase functions:secrets:set GEMINI_API_KEY
# 프롬프트에 키 값 입력
```

### 수동 배포

```bash
npm run build
firebase deploy
```

### GitHub Actions 자동 배포 설정

GitHub 저장소 → Settings → Secrets에 아래 값 등록:

| Secret 이름 | 값 |
|-------------|-----|
| `MOOVEST` | Gemini API 키 |
| `VITE_FIREBASE_API_KEY` | Firebase Web API 키 |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase 서비스 계정 JSON |

> `FIREBASE_SERVICE_ACCOUNT` 값: Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성 후 JSON 내용 전체를 시크릿 값으로 등록

---

## 🔑 Gemini API 한도

| 플랜 | 분당 요청 | 일일 요청 |
|------|-----------|-----------|
| 무료 (Spark) | 15회 | 1,500회 |
| 유료 (Pay-as-you-go) | 2,000회 | 무제한 |

→ 한도 초과 시 앱이 친절한 안내 모달을 표시합니다.

---

## 📜 라이선스

MIT © Moovest

> 이 서비스는 **정보 제공 목적**으로만 제공되며 투자 권유가 아닙니다.  
> 모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.


The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
