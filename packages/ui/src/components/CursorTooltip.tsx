import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CursorTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  className?: string;
  tooltipClassName?: string;
  animate?: boolean;
}

interface Position {
  top: number;
  left: number;
}

export function CursorTooltip({
  children,
  content,
  delay = 200,
  className = "",
  tooltipClassName = "",
  animate = true,
}: CursorTooltipProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offset = 12;
    const tooltipWidth = 280;
    const tooltipHeight = 80;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 기본적으로 요소 위에 배치
    let top = rect.top - tooltipHeight - offset;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // 화면 경계 처리
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }

    // 위쪽 공간이 부족하면 아래쪽에 배치
    if (top < 10) {
      top = rect.bottom + offset;
    }

    // 아래쪽도 공간이 부족하면 요소 옆에 배치
    if (top + tooltipHeight > viewportHeight - 10) {
      if (rect.left + rect.width + tooltipWidth + offset < viewportWidth) {
        // 오른쪽에 배치
        top = rect.top;
        left = rect.right + offset;
      } else if (rect.left - tooltipWidth - offset > 0) {
        // 왼쪽에 배치
        top = rect.top;
        left = rect.left - tooltipWidth - offset;
      }
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // 툴팁이 보이는 상태에서 마우스가 벗어나면 약간의 지연 후 숨김
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleMouseMove = () => {
    if (isVisible) {
      updatePosition();
    }
  };

  const handleTooltipMouseEnter = () => {
    // 툴팁에 마우스가 들어오면 숨김 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    // 툴팁에서 마우스가 나가면 툴팁 숨김
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          animate ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.25,
                }}
                style={{
                  position: "fixed",
                  top: position.top,
                  left: position.left,
                  zIndex: 9999,
                  pointerEvents: "auto",
                }}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                className={`
                  px-4 py-3 text-sm text-gray-800 rounded-xl border border-gray-200 bg-white shadow-2xl max-w-xs
                  ${tooltipClassName}
                `}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                zIndex: 9999,
                pointerEvents: "auto",
              }}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
              className={`
                px-4 py-3 text-sm text-gray-800 rounded-xl border border-gray-200 bg-white shadow-2xl max-w-xs
                ${tooltipClassName}
              `}
            >
              {content}
            </div>
          ),
          document.body,
        )}
    </div>
  );
}

// 간단한 텍스트용 커서 툴팁
interface SimpleCursorTooltipProps {
  children: React.ReactNode;
  text: string;
  delay?: number;
  className?: string;
  animate?: boolean;
}

export function SimpleCursorTooltip({
  children,
  text,
  delay = 200,
  className,
  animate = true,
}: SimpleCursorTooltipProps) {
  return (
    <CursorTooltip
      content={text}
      delay={delay}
      className={className}
      animate={animate}
    >
      {children}
    </CursorTooltip>
  );
}
