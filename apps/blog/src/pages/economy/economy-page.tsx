import { useMemo } from "react";
import { getEconomies } from "@/service/economy";
import { filterAndSortByDate, filterPublishedItems } from "@mfe/shared";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";
import { SEO, BreadcrumbJsonLd } from "@srf/ui";

const BASE_URL = "https://jongmany.github.io/my-blog/blog";

export default function EconomyPage() {
  const economies = getEconomies();

  const sortedEconomies = useMemo(() => {
    return filterAndSortByDate(economies, {
      filters: [filterPublishedItems],
    });
  }, [economies]);

  return (
    <>
      <SEO
        title="경제"
        description="경제 관련 학습 내용과 인사이트를 정리한 글 모음입니다."
        keywords="경제, 금융, 투자, 경제 공부"
        url={`${BASE_URL}/economy`}
        siteName="이종민 블로그"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE_URL },
          { name: "경제", url: `${BASE_URL}/economy` },
        ]}
      />
      <ContentList
        items={sortedEconomies}
        emptyMessage="경제 관련 콘텐츠가 없습니다."
        itemKey={(economy) => economy.slug}
        renderItem={(economy) => <ContentListItem item={economy} />}
      />
    </>
  );
}
