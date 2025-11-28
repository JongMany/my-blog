import { memo, useRef } from "react";
import { cn, CloseIcon } from "@srf/ui";
import { useSearchInput } from "@/hooks/use-search-input";

interface SearchInputProps {
  defaultValue: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  clearButtonLabel?: string;
}

export const SearchInput = memo(function SearchInput({
  defaultValue,
  onChange,
  onSubmit,
  placeholder = "검색(제목/요약/프로젝트명)",
  className,
  label,
  clearButtonLabel = "지우기",
}: SearchInputProps) {
  const { inputRef, inputProps, clearButtonProps, hasValue } = useSearchInput({
    defaultValue,
    onChange,
    onSubmit,
  });

  return (
    <div className={cn("relative", className)} role="search">
      <label htmlFor="search-input" className="sr-only">
        {label || "검색"}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="search-input"
          className={cn(
            "w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 pr-8 outline-none focus:ring-2 focus:ring-[var(--primary)]",
            hasValue && "pr-8",
          )}
          placeholder={placeholder}
          {...inputProps}
          aria-label={label || inputProps["aria-label"]}
        />
        <button
          id="search-clear-button"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-xs text-[var(--muted-fg)] transition-all duration-200 hover:text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer",
            hasValue ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          {...clearButtonProps}
          aria-label={clearButtonLabel}
          tabIndex={hasValue ? 0 : -1}
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
});
