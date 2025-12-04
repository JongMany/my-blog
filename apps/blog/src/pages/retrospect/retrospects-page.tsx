import { useMemo } from "react";
import { getRetrospects } from "@/service/retrospects";
import { filterAndSortByDate, filterPublishedItems } from "@mfe/shared";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";
import { SEO, BreadcrumbJsonLd } from "@srf/ui";

const BASE_URL = "https://jongmany.github.io/my-blog/blog";

export default function RetrospectsPage() {
  const retrospects = getRetrospects();

  const sortedRetrospects = useMemo(() => {
    return filterAndSortByDate(retrospects, {
      filters: [filterPublishedItems],
    });
  }, [retrospects]);

  return (
    <>
      <SEO
        title="회고"
        description="개발자로서의 성장 과정과 경험을 담은 회고 글 모음입니다."
        keywords="회고, 개발자 회고, 성장, 커리어, 프론트엔드 개발자"
        url={`${BASE_URL}/retrospect`}
        siteName="이종민 블로그"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE_URL },
          { name: "회고", url: `${BASE_URL}/retrospect` },
        ]}
      />
      <ContentList
        items={sortedRetrospects}
        emptyMessage="회고가 없습니다."
        itemKey={(retrospect) => retrospect.slug}
        renderItem={(retrospect) => <ContentListItem item={retrospect} />}
      />
    </>
  );
}
