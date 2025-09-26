import { Link } from "react-router-dom";
import type { BlogPostMeta } from "../../service/blogData";
import { assetUrl } from "@mfe/shared";

// Props 타입 정의
interface PostCardProps {
  post: BlogPostMeta;
}

// 썸네일 URL 생성 함수
function getThumbnailSrc(post: BlogPostMeta): string | null {
  return post.cover ? assetUrl(post.cover, "blog") : null;
}

export function PostCard({ post }: PostCardProps) {
  const thumbnailSrc = getThumbnailSrc(post);

  return (
    <Link
      to={`/blog/${post.category}/${post.slug}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      {/* 썸네일 영역 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/[0.04]">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl opacity-50">
            📝
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
          {post.category}
        </span>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4">
        <div className="line-clamp-1 text-base font-medium">{post.title}</div>
        <div className="mt-1 text-xs text-white/60">
          작성 {new Date(post.date).toLocaleDateString()} · 수정{" "}
          {new Date(post.updatedAt).toLocaleDateString()}
        </div>
        {post.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-white/80">
            {post.summary}
          </p>
        )}
        <div className="mt-3 inline-flex items-center text-sm text-white/80">
          더보기{" "}
          <span className="ml-1 transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}
