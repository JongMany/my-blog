import { ReactNode } from "react";
import { cn } from "@srf/ui";

interface SummaryProps {
  children: ReactNode;
  className?: string;
}

/**
 * 콘텐츠 요약 컴포넌트
 *
 * @example
 * ```tsx
 * <Summary>요약 내용</Summary>
 * <Summary className="mb-3">커스텀 스타일</Summary>
 * ```
 */
export default function Summary({ children, className }: SummaryProps) {
  return <p className={cn("text-sm text-gray-600 m-0", className)}>{children}</p>;
}
