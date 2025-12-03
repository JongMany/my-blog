import * as React from "react";

import { cn } from "../../utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-primary placeholder:text-secondary selection:bg-accent-solid selection:text-inverse dark:bg-panel/30 border-default flex h-9 w-full min-w-0 rounded-my-md border bg-transparent px-my-md py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
        className
      )}
      {...props}
    />
  );
}

export { Input };
