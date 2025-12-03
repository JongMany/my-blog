import { getPost } from "@/service/posts";
import { ContentDetailLayout } from "@/components/content-detail-layout";

export default function PostDetailPage() {
  return <ContentDetailLayout getItem={getPost} category="posts" />;
}
