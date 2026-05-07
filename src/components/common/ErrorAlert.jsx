export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">⚠️</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-red-400">
            분석 중 오류가 발생했습니다
          </p>
          <p className="text-sm text-red-400/70 mt-1 break-words">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-400 underline hover:no-underline shrink-0"
          >
            재시도
          </button>
        )}
      </div>
    </div>
  );
}
