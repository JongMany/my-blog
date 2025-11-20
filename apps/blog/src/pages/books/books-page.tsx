import React from "react";
import { getBooks } from "../../service/books";

export default function BooksPage() {
  const books = getBooks();

  return <div>BooksPage</div>;
}
