import { useMemo } from "react";
import { getPosts } from "@/service/posts";
import { filterAndSortByDate, filterPublishedItems } from "@/utils/date";
import { ContentList } from "@/components/content-list";
import { ContentListItem } from "@/components/content-list-item";

export default function PostsPage() {
  const posts = getPosts();

  const sortedPosts = useMemo(() => {
    return filterAndSortByDate(posts, {
      filters: [filterPublishedItems],
    });
  }, [posts]);

  return (
    <ContentList
      items={sortedPosts}
      emptyMessage="포스트가 없습니다."
      itemKey={(post) => post.slug}
      renderItem={(post) => <ContentListItem item={post} />}
    />
  );
}
