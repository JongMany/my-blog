import { Link } from "react-router-dom";
import type { BlogPostMeta } from "../../../service/blogData";

// Props 타입 정의
interface PostItemProps {
  post: BlogPostMeta;
}

export function PostItem({ post }: PostItemProps) {
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
