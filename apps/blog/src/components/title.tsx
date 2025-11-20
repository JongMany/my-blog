import { cn } from "@srf/ui";

interface TitleProps {
  title: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * 콘텐츠 제목 컴포넌트
 *
 * @example
 * ```tsx
 * <Title title="제목" />
 * <Title title="제목" as="h2" className="text-2xl" />
 * ```
 */
export default function Title({ title, className, as: Component = "h1" }: TitleProps) {
  return <Component className={cn("mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100", className)}>{title}</Component>;
}

