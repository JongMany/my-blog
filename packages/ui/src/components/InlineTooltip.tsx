import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface InlineTooltipProps {
  children: React.ReactElement | string | number;
  content: React.ReactElement | string | number;
  delay?: number;
  className?: string;
}

export function InlineTooltip({
  children,
  content,
  delay = 200,
  className = "",
}: InlineTooltipProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed max-w-md"
          style={{
            bottom: "12px",
            right: "12px",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg p-3">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline ${className}`}
      >
        {children}
      </span>

      {/* Portal을 통해 document.body에 직접 렌더링 */}
      {typeof document !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
}
