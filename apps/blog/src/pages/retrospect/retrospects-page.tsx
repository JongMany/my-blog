import { useMemo } from "react";
import { getRetrospects } from "@/service/retrospects";
import { filterAndSortByDate, filterPublishedItems } from "@/utils/date";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";

export default function RetrospectsPage() {
  const retrospects = getRetrospects();

  const sortedRetrospects = useMemo(() => {
    return filterAndSortByDate(retrospects, {
      filters: [filterPublishedItems],
    });
  }, [retrospects]);

  return (
    <ContentList
      items={sortedRetrospects}
      emptyMessage="회고가 없습니다."
      itemKey={(retrospect) => retrospect.slug}
      renderItem={(retrospect) => <ContentListItem item={retrospect} />}
    />
  );
}
