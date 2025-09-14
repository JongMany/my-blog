import * as React from "react";
import { cn } from "../../utils";

interface TossTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "title" | "subtitle" | "caption";
  animated?: boolean;
  delay?: number;
}

function TossText({
  children,
  variant = "default",
  animated = true,
  delay = 0,
  className,
  ...props
}: TossTextProps) {
  const variantClasses = {
    default: "text-base text-gray-700 dark:text-gray-300",
    title: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100",
    subtitle: "text-lg font-semibold text-gray-800 dark:text-gray-200",
    caption: "text-sm text-gray-500 dark:text-gray-400",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        animated && "animate-toss-fade-in",
        className,
      )}
      style={
        animated && delay > 0
          ? {
              animationDelay: `${delay}ms`,
              animationFillMode: "both",
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}

export { TossText };
