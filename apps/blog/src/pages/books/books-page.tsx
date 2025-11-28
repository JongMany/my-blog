import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "@/service/books";
import { extractDateFromMeta, compareByDate } from "@/utils/date";
import {
  groupByYearMonth,
  sortGroupedByYearMonth,
  formatMonthName,
} from "@/utils/group";

export default function BooksPage() {
  const books = getBooks();
  const navigate = useNavigate();

  // 날짜별로 그룹화
  const groupedBooks = useMemo(() => {
    const grouped = groupByYearMonth(books, (book) =>
      extractDateFromMeta(book.meta),
    );
    return sortGroupedByYearMonth(grouped, compareByDate);
  }, [books]);

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
                {months.map(({ month, items: monthBooks }) => (
                  <div key={month}>
                    <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
                      {formatMonthName(month)}
                    </h3>

                    <ul className="space-y-1.5">
                      {monthBooks.map((book) => (
                        <li key={book.slug} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <button
                            type="button"
                            onClick={() => navigate(`/${book.slug}`)}
                            className="group flex-1 text-left text-sm text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer"
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
