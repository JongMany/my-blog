import { BookMeta } from "../types/contents/book";
import { parseFrontmatter } from "../utils/frontmatter";

/**
 * 책 목록을 가져오는 함수
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
 *   return <div>{books.map(book => <div key={book.slug}>{book.title}</div>)}</div>;
 * }
 * ```
 */
export function getBooks(): BookMeta[] {
  // ⚠️ Vite는 리터럴 문자열만 허용하므로, 이 파일 위치 기준 상대 경로를 직접 사용
  const modules = import.meta.glob<string>("../contents/books/**/*.{md,mdx}", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const books: BookMeta[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    // raw content를 가져옴
    const rawContent = module as unknown as string;
    const { data: frontmatter } = parseFrontmatter(rawContent);

    // 파일 경로에서 slug 추출
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const slug =
      (frontmatter.slug as string) || fileName.replace(/\.(md|mdx)$/, "");

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    const meta: BookMeta = {
      title: (frontmatter.title as string) || slug,
      ...frontmatter,
      slug,
      path: relativePath,
    };

    books.push(meta);
  }

  return books;
}
