import { Component } from "react";

/**
 * API Quota 초과 및 예상치 못한 렌더링 에러를 처리하는 에러 바운더리
 * Quota 에러: 429 / RESOURCE_EXHAUSTED
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorName: null, errorMessage: null };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorName: error.name,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error, info) {
    console.error("[Moovest ErrorBoundary]", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isQuota = this.state.errorName === "QuotaExceededError";
    const isApiKey = this.state.errorName === "ApiKeyError";

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">
            {isQuota ? "⏳" : isApiKey ? "🔑" : "❌"}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {isQuota
              ? "API 요청 한도 초과"
              : isApiKey
                ? "API 키 오류"
                : "앱 오류 발생"}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {this.state.errorMessage}
          </p>
          {isQuota && (
            <p className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-3 mb-4">
              💡 Gemini 무료 플랜은 분당 15회, 일일 1,500회 요청 제한이
              있습니다. 내일 자정(UTC) 이후 다시 사용할 수 있습니다.
            </p>
          )}
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
}
