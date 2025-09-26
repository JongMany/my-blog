interface FilterChipsProps {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
  onClearClick: () => void;
  clearLabel: string;
  itemPrefix?: string;
  className?: string;
}

export function FilterChips({
  items,
  activeItem,
  onItemClick,
  onClearClick,
  clearLabel,
  itemPrefix = "",
  className = "flex flex-wrap gap-2",
}: FilterChipsProps) {
  return (
    <div className={className}>
      <button
        className={`t-chip ${!activeItem ? "ring-1 ring-[var(--primary)]" : ""}`}
        onClick={onClearClick}
      >
        {clearLabel}
      </button>
      {items.map((item) => {
        const isActive = activeItem === item;
        return (
          <button
            key={item}
            className={`t-chip ${isActive ? "ring-1 ring-[var(--primary)]" : ""}`}
            onClick={() => onItemClick(item)}
            aria-pressed={isActive}
          >
            {itemPrefix}
            {item}
          </button>
        );
      })}
    </div>
  );
}
