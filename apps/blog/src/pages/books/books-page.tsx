import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../service/books";
import { Item, BookMeta } from "../../types/contents/book";

interface GroupedBooks {
  year: string;
  months: {
    month: string;
    books: Item<BookMeta>[];
  }[];
}

export default function BooksPage() {
  const books = getBooks();
  const navigate = useNavigate();

  // 날짜별로 그룹화
  const groupedBooks = useMemo(() => {
    const grouped: Record<string, Record<string, Item<BookMeta>[]>> = {};

    books.forEach((book) => {
      // createdAt 또는 date 필드에서 날짜 추출
      const dateStr = (book.meta.createdAt as string) || book.meta.date || "";
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;

      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();

      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }
      grouped[year][month].push(book);
    });

    // 년도별, 월별로 정렬
    const result: GroupedBooks[] = Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a)) // 최신년도부터
      .map((year) => {
        const months = Object.keys(grouped[year])
          .sort((a, b) => Number(b) - Number(a)) // 최신월부터
          .map((month) => ({
            month,
            books: grouped[year][month].sort((a, b) => {
              const dateA = new Date(
                (a.meta.createdAt as string) || a.meta.date || "",
              );
              const dateB = new Date(
                (b.meta.createdAt as string) || b.meta.date || "",
              );
              return dateB.getTime() - dateA.getTime(); // 최신순
            }),
          }));

        return { year, months };
      });

    return result;
  }, [books]);

  const getMonthName = (month: string) => {
    const monthNum = Number(month);
    return `${monthNum}월`;
  };

  return (
    <div className="max-w-2xl">
      {groupedBooks.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          읽은 책이 없습니다.
        </div>
      ) : (
        <div className="space-y-10">
          {groupedBooks.map(({ year, months }) => (
            <div key={year}>
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {year}년
              </h2>

              <div className="space-y-5">
                {months.map(({ month, books: monthBooks }) => (
                  <div key={month}>
                    <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
                      {getMonthName(month)}
                    </h3>

                    <ul className="space-y-1.5">
                      {monthBooks.map((book) => (
                        <li key={book.slug} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <button
                            onClick={() => navigate(`/${book.slug}`)}
                            className="group flex-1 text-left text-sm text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                          >
                            {book.meta.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
