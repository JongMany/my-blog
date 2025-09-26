import { useParams } from "react-router-dom";
import { useBlogIndex } from "../../service/blogQueries";
import { PostCard } from "../../components/post";
import { LoadingState, ErrorState } from "../../components/common";

export default function CategoryPage() {
  const { category = "" } = useParams();
  const { data, isLoading, isError, error } = useBlogIndex();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error as Error} />;
  }

  const posts = data?.byCategory?.[category] ?? [];

  return (
    <div>
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{category}</h2>
        <span className="text-sm text-white/70">{posts.length}개 글</span>
      </header>

      {posts.length === 0 ? (
        <p className="opacity-80">이 카테고리에 글이 없어요.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={`${post.category}/${post.slug}`} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
