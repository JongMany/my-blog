import { cn } from "@srf/ui";

interface SelectableChipsProps {
  items: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onReset: () => void;
  allLabel: string;
  prefix?: string;
  className?: string;
}

function getChipClassName(isSelected: boolean, isAllButton = false): string {
  return cn(
    "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer",
    "border transition-colors duration-300 ease-in-out",
    isAllButton
      ? cn(
          isSelected
            ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold"
            : "bg-[var(--surface)] text-[var(--muted-fg)] border-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--fg)]",
        )
      : cn(
          isSelected
            ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold"
            : "bg-transparent text-[var(--muted-fg)] border-[var(--border)] hover:bg-[var(--hover-bg)] hover:text-[var(--fg)] hover:border-[var(--primary)]/30",
        ),
  );
}

export function SelectableChips({
  items,
  selectedValue,
  onSelect,
  onReset,
  allLabel,
  prefix = "",
  className,
}: SelectableChipsProps) {
  const isAllSelected = !selectedValue;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <button
        type="button"
        className={getChipClassName(isAllSelected, true)}
        onClick={onReset}
      >
        {allLabel}
      </button>
      {items.map((item) => {
        const isSelected = selectedValue === item;
        return (
          <button
            key={item}
            type="button"
            className={getChipClassName(isSelected, false)}
            onClick={() => onSelect(item)}
            aria-pressed={isSelected}
          >
            {prefix}
            {item}
          </button>
        );
      })}
    </div>
  );
}
