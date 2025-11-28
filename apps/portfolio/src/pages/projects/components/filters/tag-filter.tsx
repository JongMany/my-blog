import { useMemo } from "react";
import { cn } from "@srf/ui";
import { UI_CONSTANTS } from "@/pages/projects/constants/ui";

const TAG_BUTTON_BASE =
  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all duration-300 ease-in-out";

const TAG_BUTTON_SELECTED =
  "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold";

const TAG_BUTTON_UNSELECTED =
  "bg-transparent text-[var(--muted-fg)] border-[var(--border)] hover:bg-[var(--hover-bg)] hover:text-[var(--fg)] hover:border-[var(--primary)]/30";

interface TagButtonProps {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
  showAnimation?: boolean;
  showPrefix?: boolean;
}

function TagButton({
  tag,
  isSelected,
  onClick,
  showAnimation = false,
  showPrefix = true,
}: TagButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        TAG_BUTTON_BASE,
        showAnimation && "animate-fade-in",
        isSelected ? TAG_BUTTON_SELECTED : TAG_BUTTON_UNSELECTED,
      )}
      aria-pressed={isSelected}
    >
      {showPrefix && UI_CONSTANTS.TAG_PREFIX}
      {tag}
    </button>
  );
}

interface TagFilterProps {
  availableTags: string[];
  selectedTag: string;
  onSelect: (tag: string) => void;
  onReset: () => void;
}

export function TagFilter({
  availableTags,
  selectedTag,
  onSelect,
  onReset,
}: TagFilterProps) {
  const tagsKey = useMemo(() => availableTags.join(","), [availableTags]);

  return (
    <div className="flex flex-wrap gap-1.5">
      <TagButton
        tag={UI_CONSTANTS.ALL_TAGS_LABEL}
        isSelected={!selectedTag}
        onClick={onReset}
        showPrefix={false}
      />
      <div key={tagsKey} className="contents">
        {availableTags.map((tag) => (
          <TagButton
            key={tag}
            tag={tag}
            isSelected={selectedTag === tag}
            onClick={() => onSelect(tag)}
            showAnimation
          />
        ))}
      </div>
    </div>
  );
}

