import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listPosts } from "../../service/api";
import PostList from "../../components/PostList";

export default function PostsPage() {
  const { data = [] } = useQuery({ queryKey: ["posts"], queryFn: listPosts });
  return (
    <div>
      <h3 className="mb-3 text-lg font-medium">전체 글</h3>
      <PostList items={data} />
    </div>
  );
}
