import React from "react";
import { getBooks } from "../../service/books";
import { Item, BookMeta } from "../../types/contents/book";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const books = getBooks();
  const navigate = useNavigate();

  return (
    <div>
      <h1>HomePage</h1>
      <div>
        <h2>Books ({books.length})</h2>
        {books.length === 0 ? (
          <p>책이 없습니다.</p>
        ) : (
          <ul>
            {books.map((book: Item<BookMeta>) => (
              <li onClick={() => navigate(`${book.slug}`)} key={book.slug}>
                {book.meta.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
