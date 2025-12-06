import { useMemo } from "react";
import { getPosts } from "@/service/posts";
import { filterAndSortByDate, filterPublishedItems } from "@mfe/shared";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";
import { SEO, BreadcrumbJsonLd } from "@srf/ui";

const BASE_URL = "https://jongmany.github.io/my-blog/blog";

export default function PostsPage() {
  const posts = getPosts();

  const sortedPosts = useMemo(() => {
    return filterAndSortByDate(posts, {
      filters: [filterPublishedItems],
    });
  }, [posts]) as typeof posts;

  return (
    <>
      <SEO
        title="포스트"
        description="프론트엔드 개발 관련 기술 포스트 모음입니다. React, TypeScript, JavaScript 등 다양한 주제를 다룹니다."
        keywords="프론트엔드, React, TypeScript, JavaScript, 웹 개발, 기술 블로그"
        url={`${BASE_URL}/posts`}
        siteName="이종민 블로그"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE_URL },
          { name: "포스트", url: `${BASE_URL}/posts` },
        ]}
      />
      <ContentList
        items={sortedPosts}
        emptyMessage="포스트가 없습니다."
        itemKey={(post) => post.slug}
        renderItem={(post) => <ContentListItem item={post} />}
      />
    </>
  );
}
