import { Link } from "react-router-dom";
import type { BlogPostMeta } from "../service/blogData";
import { cn } from "@srf/ui";

// Props 타입 정의
interface PostListProps {
  items: BlogPostMeta[];
  emptyText?: string;
}

// 개별 포스트 아이템 컴포넌트
interface PostItemProps {
  post: BlogPostMeta;
}

function PostItem({ post }: PostItemProps) {
  return (
    <li className="t-card p-4 hover:shadow-lg transition-shadow">
      <Link
        to={`/blog/${post.category}/${post.slug}`}
        className="text-[var(--fg)] hover:underline font-medium"
      >
        {post.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-fg)]">
        <Link
          to={`/blog/c/${encodeURIComponent(post.category)}`}
          className="t-chip hover:bg-[var(--hover-bg)]"
        >
          #{post.category}
        </Link>
        <span className="ml-auto">{new Date(post.date).toLocaleString()}</span>
      </div>
    </li>
  );
}

// 빈 상태 컴포넌트
interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-[var(--muted-fg)]">{message}</p>
    </div>
  );
}

// 메인 PostList 컴포넌트
export default function PostList({
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
