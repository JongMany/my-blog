import { useBlogIndex } from "../../service/blogData";
import { PostCard } from "../../components/post";
import { LoadingState, ErrorState } from "../../components/common";

export default function HomePage() {
  const { data, isLoading, isError, error } = useBlogIndex();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error as Error} />;
  }

  if (!data) {
    return (
      <div className="text-center">
        <p className="text-white/70">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.all.map((post) => (
        <PostCard key={`${post.category}/${post.slug}`} post={post} />
      ))}
    </div>
  );
}
