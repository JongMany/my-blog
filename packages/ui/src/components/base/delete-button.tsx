import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface DeleteButtonProps {
  /**
   * 버튼의 상태
   */
  variant?: "default" | "confirm" | "goingBack";
  /**
   * 삭제 확인 텍스트
   */
  confirmText?: string;
  /**
   * 삭제 버튼 텍스트
   */
  deleteText?: string;
  /**
   * 클릭 핸들러
   */
  onDelete?: () => void;
  /**
   * 확인 핸들러
   */
  onConfirm?: () => void;
  /**
   * 취소 핸들러
   */
  onCancel?: () => void;
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  /**
   * 추가 스타일
   */
  style?: React.CSSProperties;
}

type ButtonState = "default" | "confirm" | "goingBack";

/**
 * 삭제 확인 버튼 컴포넌트
 * 클릭 시 확인 상태로 변하고, X 버튼으로 취소할 수 있습니다.
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  variant = "default",
  confirmText = "Confirm",
  deleteText = "Delete",
  onDelete,
  onConfirm,
  onCancel,
  className,
  disabled = false,
  style,
}) => {
  const [currentState, setCurrentState] = useState<ButtonState>(variant);
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // variant prop이 변경되면 상태 업데이트
  useEffect(() => {
    setCurrentState(variant);
  }, [variant]);

  // 자동으로 goingBack 상태로 전환하는 타이머
  useEffect(() => {
    if (currentState === "confirm") {
      timeoutRef.current = setTimeout(() => {
        setCurrentState("goingBack");
      }, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentState]);

  const handleDeleteClick = () => {
    if (disabled) return;

    setIsPressed(true);
    setCurrentState("confirm");
    onDelete?.();

    // 짧은 딜레이 후 pressed 상태 해제
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleConfirmClick = () => {
    if (disabled) return;
    onConfirm?.();
  };

  const handleCancelClick = () => {
    if (disabled) return;
    setCurrentState("goingBack");
    onCancel?.();
  };

  const handleGoingBackComplete = () => {
    setCurrentState("default");
  };

  const isConfirmState = currentState === "confirm";
  const isGoingBackState = currentState === "goingBack";
  const isDefaultState = currentState === "default";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center gap-2.5 cursor-pointer",
        "transition-all duration-300 ease-out",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={style}
    >
      {/* 메인 버튼 */}
      <button
        onClick={handleDeleteClick}
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center px-6 h-11 rounded-2xl",
          "transition-all duration-300 ease-out",
          "font-semibold text-sm text-white",
          "transform-gpu will-change-transform",
          // 기본 상태
          isDefaultState && "bg-red-600 hover:bg-red-700",
          // 확인 상태
          isConfirmState && "bg-black",
          // goingBack 상태
          isGoingBackState && "bg-black scale-90",
          // pressed 상태
          isPressed && "scale-90 bg-black",
        )}
        style={{
          backgroundColor: isPressed ? "rgb(0, 0, 0)" : undefined,
        }}
      >
        {/* Delete 텍스트 */}
        <span
          className={cn(
            "transition-opacity duration-300",
            isConfirmState || isGoingBackState ? "opacity-0" : "opacity-100",
          )}
        >
          {deleteText}
        </span>

        {/* Confirm 텍스트 */}
        <span
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "transition-opacity duration-300",
            isConfirmState ? "opacity-100" : "opacity-0",
          )}
        >
          {confirmText}
        </span>
      </button>

      {/* X 버튼 */}
      <button
        onClick={handleCancelClick}
        disabled={disabled}
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2",
          "w-10 h-10 rounded-full bg-black",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "transform-gpu will-change-transform",
          // 기본 상태에서는 숨김
          isDefaultState && "opacity-0 scale-0",
          // 확인 상태에서 나타남
          isConfirmState && "opacity-100 scale-100 right-1",
          // goingBack 상태에서 더 오른쪽으로 이동
          isGoingBackState && "opacity-100 scale-100 -right-14",
          // 호버 효과
          "hover:bg-gray-800",
        )}
        style={{
          transform: `rotateX(${isConfirmState ? "0deg" : "60deg"})`,
        }}
      >
        {(X as any)({ className: "w-5 h-5 text-white" })}
      </button>

      {/* Gooey Effect 대체 - 간단한 CSS 효과 */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl",
          "transition-opacity duration-300",
          isConfirmState ? "opacity-100" : "opacity-0",
          "pointer-events-none",
        )}
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%),
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          filter: "blur(1px)",
        }}
      />
    </div>
  );
};

DeleteButton.displayName = "DeleteButton";
