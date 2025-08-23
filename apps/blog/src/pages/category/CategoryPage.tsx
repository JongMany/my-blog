import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPostsByCategory } from "../../service/api";
import PostList from "../../components/PostList";
import { qk } from "../../service/queryKey";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: qk.postsByCategory(slug),
    queryFn: () => listPostsByCategory(slug),
  });

  return (
    <div>
      <h3 className="mb-3 text-lg font-medium">
        카테고리: {decodeURIComponent(slug)}
      </h3>
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <PostList items={posts} emptyText="이 카테고리에 글이 없습니다." />
      )}
    </div>
  );
}
