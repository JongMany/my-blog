import { useMemo } from "react";
import { getLogs } from "@/service/logs";
import { filterAndSortByDate, filterPublishedItems } from "@/utils/date";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";

export default function LogsPage() {
  const logs = getLogs();

  const sortedLogs = useMemo(() => {
    return filterAndSortByDate(logs, {
      filters: [filterPublishedItems],
    });
  }, [logs]);

  return (
    <ContentList
      items={sortedLogs}
      emptyMessage="기록이 없습니다."
      itemKey={(log) => log.slug}
      renderItem={(log) => <ContentListItem item={log} />}
    />
  );
}
