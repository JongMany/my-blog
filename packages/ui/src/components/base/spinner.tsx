import * as React from "react";
import { cn } from "../../utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
}

function Spinner({ size = "md", text, className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const spinner = (
    <div className={cn(sizeClasses[size], className)} {...props} />
  );

  if (!text) {
    return spinner;
  }

  return (
    <div className="flex items-center space-x-3">
      {spinner}
      <span className="text-sm font-medium text-secondary">
        {text}
      </span>
    </div>
  );
}

export { Spinner };
