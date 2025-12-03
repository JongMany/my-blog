import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "@/service/books";
import { extractDateFromMeta, compareByDate } from "@/utils/date";
import {
  groupByYearMonth,
  sortGroupedByYearMonth,
  formatMonthName,
} from "@/utils/group";
import { SEO, BreadcrumbJsonLd } from "@srf/ui";

const BASE_URL = "https://jongmany.github.io/my-blog/blog";

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
    <>
      <SEO
        title="도서 리뷰"
        description="읽은 책들에 대한 리뷰와 인상 깊었던 내용을 정리한 글 모음입니다."
        keywords="도서 리뷰, 책 리뷰, 개발 서적, 프로그래밍 책, 독서"
        url={`${BASE_URL}/books`}
        siteName="이종민 블로그"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: BASE_URL },
          { name: "도서 리뷰", url: `${BASE_URL}/books` },
        ]}
      />
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
    </>
  );
}
