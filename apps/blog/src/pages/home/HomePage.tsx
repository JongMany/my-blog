import React from "react";
import { getBooks } from "../../service/books";
import { BookMeta } from "../../types/contents/book";

export default function HomePage() {
  // pages에서도 사용 가능합니다!
  const books = getBooks();

  console.log(books);
  return (
    <div>
      <h1>HomePage</h1>
      <div>
        <h2>Books ({books.length})</h2>
        {books.length === 0 ? (
          <p>책이 없습니다.</p>
        ) : (
          <ul>
            {books.map((book: BookMeta) => (
              <li key={book.slug}>{book.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
