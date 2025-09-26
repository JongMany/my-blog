import type { BlogPostMeta } from "../../../service/blogData";
import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";

// Props 타입 정의
interface PostListProps {
  items: BlogPostMeta[];
  emptyText?: string;
}

// 메인 PostList 컴포넌트
export function PostList({
  items,
  emptyText = "글이 없습니다.",
}: PostListProps) {
  if (items.length === 0) {
    return <EmptyState message={emptyText} />;
  }

  return (
    <ul className="grid gap-3">
      {items.map((post) => (
        <PostItem key={`${post.category}/${post.slug}`} post={post} />
      ))}
    </ul>
  );
}
