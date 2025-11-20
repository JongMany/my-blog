import { BookMeta, Item } from "../types/contents/book";
import { parseFrontmatter } from "../utils/frontmatter";

/**
 * 모든 책 목록을 가져오는 함수 (Item 형태)
 *
 * Vite의 import.meta.glob을 사용하여 빌드 타임에 모든 파일을 번들에 포함시킵니다.
 * CSR 환경에서도 동작합니다.
 *
 * ⚠️ 주의:
 * - 이 함수는 Next.js의 `process.cwd()`를 사용하지 않습니다.
 * - Vite의 `import.meta.glob`은 리터럴 문자열만 허용하므로,
 *   이 파일의 위치를 기준으로 한 상대 경로를 사용합니다.
 *
 * @example
 * ```tsx
 * import { getBooks } from '../service/books';
 *
 * function BooksPage() {
 *   const books = getBooks();
 *   return <div>{books.map(book => (
 *     <div key={book.slug}>
 *       <h2>{book.meta.title}</h2>
 *       <p>읽기 시간: {book.readingTime}분</p>
 *     </div>
 *   ))}</div>;
 * }
 * ```
 */
export function getBooks(): Item<BookMeta>[] {
  return getAllBooks();
}

/**
 * 모든 책을 Item 형태로 가져오는 함수 (내부 함수)
 */
function getAllBooks(): Item<BookMeta>[] {
  // ⚠️ Vite는 리터럴 문자열만 허용하므로, 이 파일 위치 기준 상대 경로를 직접 사용
  const modules = import.meta.glob<string>("../contents/books/**/*.{md,mdx}", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const books: Item<BookMeta>[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    // raw content를 가져옴
    const rawContent = module as unknown as string;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    // 파일 경로에서 정보 추출
    // filePath 예: "../contents/books/linchipin.mdx"
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");

    // "books" 디렉토리명 찾기 (contents 다음 디렉토리)
    const contentsIndex = pathParts.findIndex((part) => part === "contents");
    const categoryDir =
      contentsIndex >= 0 && contentsIndex < pathParts.length - 1
        ? pathParts[contentsIndex + 1]
        : "books";

    // slug 생성: "books/linchipin" 형태
    const defaultSlug = `${categoryDir}/${fileNameWithoutExt}`;
    const slug = (frontmatter.slug as string) || defaultSlug;

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    const meta: BookMeta = {
      title: (frontmatter.title as string) || fileNameWithoutExt,
      ...frontmatter,
      slug,
      path: relativePath,
    };

    books.push({
      slug,
      content,
      meta,
    });
  }

  return books;
}

/**
 * 특정 slug의 책을 가져오는 함수
 *
 * @param slug 책의 slug
 * @returns 책 정보 (Item 형태), 없으면 undefined
 *
 * @example
 * ```tsx
 * import { getBook } from '../service/books';
 *
 * function BookDetailPage({ slug }: { slug: string }) {
 *   const book = getBook(slug);
 *   if (!book) return <div>책을 찾을 수 없습니다.</div>;
 *
 *   return (
 *     <div>
 *       <h1>{book.meta.title}</h1>
 *       <div>{book.content}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function getBook(slug: string): Item<BookMeta> | undefined {
  const books = getAllBooks();
  return books.find((book) => book.slug === slug);
}
