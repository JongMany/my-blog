import { getBook } from "@/service/books";
import { ContentDetailLayout } from "@/components/content-detail-layout";

export default function BookDetailPage() {
  return <ContentDetailLayout getItem={getBook} category="books" />;
}
