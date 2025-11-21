import * as React from "react";
import { TossSpinner } from "./toss-spinner";

interface TossRemoteLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  appName?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  attempts?: number;
  maxAttempts?: number;
  isLoading?: boolean;
}

// 애니메이션 키프레임을 동적으로 주입하는 함수
function injectTossAnimations() {
  if (typeof document === "undefined") return;

  const styleId = "toss-remote-loader-animations";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes toss-fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

const CONTAINER_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: "320px",
  padding: "32px",
};

const TEXT_STYLE: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "16px",
  color: "#64748b",
  animation: "toss-fade-in 0.3s ease-in",
};

const ERROR_TEXT_STYLE: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "14px",
  color: "#ef4444",
};

const BUTTON_STYLE: React.CSSProperties = {
  marginTop: "24px",
  background: "#3182f6",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "14px",
  fontWeight: 500,
  padding: "10px 20px",
  cursor: "pointer",
};

function TossRemoteLoader({
  className,
  appName,
  message,
  error,
  onRetry,
  attempts = 0,
  maxAttempts = 3,
  isLoading = true,
  ...props
}: TossRemoteLoaderProps) {
  React.useEffect(() => {
    injectTossAnimations();
  }, []);

  const getLoadingMessage = () => {
    if (message) return message;
    if (appName) return `${appName} 불러오는 중`;
    return "불러오는 중";
  };

  // 에러 상태
  if (error) {
    return (
      <div style={CONTAINER_STYLE} className={className} {...props}>
        <TossSpinner size="lg" />
        <div style={ERROR_TEXT_STYLE}>
          {appName ? `${appName}을` : "페이지를"} 불러올 수 없습니다
        </div>
        {onRetry && attempts >= maxAttempts && (
          <button onClick={onRetry} style={BUTTON_STYLE}>
            다시 시도
          </button>
        )}
      </div>
    );
  }

  // 로딩 상태
  return (
    <div style={CONTAINER_STYLE} className={className} {...props}>
      <TossSpinner size="lg" />
      <div style={TEXT_STYLE}>{getLoadingMessage()}</div>
    </div>
  );
}

export { TossRemoteLoader };
