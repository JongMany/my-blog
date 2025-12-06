import { useMemo } from "react";
import { getLogs } from "@/service/logs";
import { filterAndSortByDate, filterPublishedItems } from "@mfe/shared";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";
import { SEO, BreadcrumbJsonLd } from "@srf/ui";

const BASE_URL = "https://jongmany.github.io/my-blog/blog";

export default function LogsPage() {
  const logs = getLogs();

  const sortedLogs = useMemo(() => {
    return filterAndSortByDate(logs, {
      filters: [filterPublishedItems],
    });
  }, [logs]) as typeof logs;

  return (
    <>
      <SEO
        title="개발 로그"
        description="개발 과정에서의 기록, 컨퍼런스 참여 후기, 학습 내용 등을 정리한 로그입니다."
        keywords="개발 로그, 컨퍼런스, 학습 기록, 개발 일지"
        url={`${BASE_URL}/logs`}
        siteName="이종민 블로그"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE_URL },
          { name: "개발 로그", url: `${BASE_URL}/logs` },
        ]}
      />
      <ContentList
        items={sortedLogs}
        emptyMessage="기록이 없습니다."
        itemKey={(log) => log.slug}
        renderItem={(log) => <ContentListItem item={log} />}
      />
    </>
  );
}
