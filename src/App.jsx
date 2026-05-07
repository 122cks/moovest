import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./store/AppContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/Dashboard/Dashboard";
import HistorySidebar from "./components/history/HistorySidebar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProgressBar from "./components/common/ProgressBar";
import ApiErrorModal from "./components/common/ApiErrorModal";
import ToastNotification from "./components/common/ToastNotification";
import { useGeminiAnalysis } from "./hooks/useGeminiAnalysis";
import { useMarketData } from "./hooks/useMarketData";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { getRankingHistory } from "./api/firebase/fetchHistory";

function AppContent() {
  const {
    topStocks,
    isLoading,
    error,
    errorType,
    episode,
    progress,
    runAnalysis,
    setTopStocks,
    setEpisode,
  } = useGeminiAnalysis();
  const { market, setMarket } = useMarketData();
  const { sidebarOpen, setSidebarOpen, historyData, setHistoryData } = useApp();
  const { isOnline, showOfflineToast } = useOnlineStatus();
  const [showErrorModal, setShowErrorModal] = useState(false);

  // API 키/쿼터 에러 발생 시 모달 열기
  useEffect(() => {
    if (errorType === "apikey" || errorType === "quota") {
      setShowErrorModal(true);
    }
  }, [errorType]);

  // Firebase에서 과거 기록 불러오기 (초기 및 새 분석 후)
  useEffect(() => {
    getRankingHistory().then(setHistoryData).catch(console.warn);
  }, [episode, setHistoryData]);

  const handleRefresh = () => runAnalysis(market);

  const handleHistorySelect = (item) => {
    setTopStocks(item.top5 || []);
    setEpisode(item.episode);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header
        market={market}
        onMarketChange={setMarket}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onHistoryOpen={() => setSidebarOpen(true)}
        historyCount={historyData.length}
      />

      <ProgressBar progress={progress} isVisible={isLoading} />

      <Dashboard
        stocks={topStocks}
        isLoading={isLoading}
        error={errorType !== "apikey" && errorType !== "quota" ? error : null}
        market={market}
        episode={episode}
        onRetry={handleRefresh}
      />

      <Footer />

      <HistorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={historyData}
        onSelect={handleHistorySelect}
      />

      <ApiErrorModal
        errorType={showErrorModal ? errorType : null}
        errorMessage={error}
        onClose={() => setShowErrorModal(false)}
      />

      <ToastNotification isOnline={isOnline} errorType={errorType} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
