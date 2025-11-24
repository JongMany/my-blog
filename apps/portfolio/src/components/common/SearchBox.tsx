import React from "react";
import { cn } from "@srf/ui";

interface SearchBoxProps {
  initial: string;
  onChangeText: (value: string) => void;
  onCommit: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox = React.memo(function SearchBox({
  initial,
  onChangeText,
  onCommit,
  placeholder = "검색(제목/요약/프로젝트명)",
  className,
}: SearchBoxProps) {
  const [value, setValue] = React.useState(initial);
  const composingRef = React.useRef(false);

  // initial prop이 변경되면 내부 상태도 업데이트
  React.useEffect(() => {
    setValue(initial);
  }, [initial]);

  // 로컬 값이 바뀌면 필터링에만 반영 (URL은 건드리지 않음)
  React.useEffect(() => {
    onChangeText(value);
  }, [value, onChangeText]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onCompositionStart={() => (composingRef.current = true)}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          setValue(e.currentTarget.value); // 조합 종료 후 최종 문자열 유지
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !composingRef.current) {
            onCommit(value); // Enter 시에만 URL 반영
          }
        }}
        onBlur={() => {
          if (!composingRef.current) onCommit(value); // Blur 시 URL 반영
        }}
        lang="ko"
        inputMode="text"
        autoComplete="off"
      />
      {value && (
        <button className="t-btn text-xs" onClick={() => setValue("")}>
          지우기
        </button>
      )}
    </div>
  );
});
