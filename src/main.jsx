import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { validateEnv } from "./utils/envValidator";

// 필수 환경변수 검증 (개발 환경: 경고, 운영 환경: 앱 중단)
validateEnv();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
