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

function getChipClassName(isSelected: boolean): string {
  return cn(
    "t-chip transition-all cursor-pointer",
    isSelected && "ring-1 ring-[var(--primary)]",
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
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button className={getChipClassName(isAllSelected)} onClick={onReset}>
        {allLabel}
      </button>
      {items.map((item) => {
        const isSelected = selectedValue === item;
        return (
          <button
            key={item}
            className={getChipClassName(isSelected)}
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
