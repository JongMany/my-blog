import * as React from "react";
import { cn } from "../../utils";
import { TossSpinner } from "./toss-spinner";
import { TossText } from "./toss-text";
import { TossAnimatedText } from "./toss-animated-text";

interface TossRemoteLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  appName?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  attempts?: number;
  maxAttempts?: number;
  isLoading?: boolean;
}

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
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getLoadingMessage = () => {
    if (message) return message;
    if (appName) return `${appName} 불러오는 중`;
    return "불러오는 중";
  };

  // 에러 상태
  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full min-h-[320px] p-8",
          className,
        )}
        {...props}
      >
        <div className="toss-container p-8 max-w-md mx-auto text-center">
          {showContent && (
            <>
              <div className="animate-toss-scale-in text-6xl mb-6">😔</div>

              <TossAnimatedText
                variant="title"
                animationType="char-by-char"
                delay={200}
                speed={100}
                className="mb-4"
              >
                문제가 발생했어요
              </TossAnimatedText>

              <TossText variant="default" delay={400} className="mb-6">
                {appName ? `${appName}을` : "페이지를"} 불러올 수 없습니다
              </TossText>

              {attempts < maxAttempts && (
                <div
                  className="flex items-center justify-center space-x-3 mb-6 animate-toss-fade-in"
                  style={{ animationDelay: "600ms", animationFillMode: "both" }}
                >
                  <TossSpinner size="sm" />
                  <span className="text-sm text-gray-500">
                    재시도 중... ({attempts + 1}/{maxAttempts})
                  </span>
                </div>
              )}

              {onRetry && attempts >= maxAttempts && (
                <button
                  onClick={onRetry}
                  className="toss-button animate-toss-fade-in"
                  style={{ animationDelay: "600ms", animationFillMode: "both" }}
                >
                  다시 시도
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // 로딩 상태
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[320px] p-8",
        className,
      )}
      {...props}
    >
      <div className="toss-container p-8 max-w-md mx-auto text-center">
        {showContent && (
          <>
            <div className="animate-toss-scale-in mb-8">
              <TossSpinner size="xl" />
            </div>

            <TossAnimatedText
              variant="title"
              animationType="typing"
              delay={200}
              className="mb-3"
            >
              {getLoadingMessage()}
            </TossAnimatedText>

            <TossAnimatedText
              variant="caption"
              animationType="word-by-word"
              delay={1500}
              speed={60}
            >
              잠시만 기다려 주세요
            </TossAnimatedText>
          </>
        )}
      </div>
    </div>
  );
}

export { TossRemoteLoader };
