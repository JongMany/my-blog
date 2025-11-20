import { useParams } from "react-router-dom";
import { getBook } from "../../service/books";

export default function BookDetailPage() {
  const { slug } = useParams();
  const book = getBook(slug ?? "");
  console.log(book, slug);

  return <div>BookDetailPage</div>;
}
