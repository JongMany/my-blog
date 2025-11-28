import { SearchInput } from "../../../../components/common";
import { UI_CONSTANTS } from "../../constants/ui";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchCommit: (value: string) => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  onSearchCommit,
}: SearchFilterProps) {
  return (
    <SearchInput
      key={searchQuery}
      defaultValue={searchQuery}
      onChange={onSearchChange}
      onSubmit={onSearchCommit}
      placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
    />
  );
}

