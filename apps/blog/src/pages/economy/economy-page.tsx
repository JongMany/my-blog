import { useMemo } from "react";
import { getEconomies } from "@/service/economy";
import { filterAndSortByDate, filterPublishedItems } from "@/utils/date";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";

export default function EconomyPage() {
  const economies = getEconomies();

  const sortedEconomies = useMemo(() => {
    return filterAndSortByDate(economies, {
      filters: [filterPublishedItems],
    });
  }, [economies]);

  return (
    <ContentList
      items={sortedEconomies}
      emptyMessage="경제 관련 콘텐츠가 없습니다."
      itemKey={(economy) => economy.slug}
      renderItem={(economy) => <ContentListItem item={economy} />}
    />
  );
}
