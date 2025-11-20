import { RetrospectMeta, Item } from "../types/contents/retrospect";
import { parseFrontmatter } from "../utils/frontmatter";

/**
 * 모든 회고 목록을 가져오는 함수 (Item 형태)
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
 * import { getRetrospects } from '../service/retrospects';
 *
 * function RetrospectsPage() {
 *   const retrospects = getRetrospects();
 *   return <div>{retrospects.map(retrospect => (
 *     <div key={retrospect.slug}>
 *       <h2>{retrospect.meta.title}</h2>
 *       <p>{retrospect.meta.summary}</p>
 *     </div>
 *   ))}</div>;
 * }
 * ```
 */
export function getRetrospects(): Item<RetrospectMeta>[] {
  return getAllRetrospects();
}

/**
 * 모든 회고를 Item 형태로 가져오는 함수 (내부 함수)
 */
function getAllRetrospects(): Item<RetrospectMeta>[] {
  // ⚠️ Vite는 리터럴 문자열만 허용하므로, 이 파일 위치 기준 상대 경로를 직접 사용
  const modules = import.meta.glob<string>(
    "../contents/retrospect/**/*.{md,mdx}",
    {
      eager: true,
      query: "?raw",
      import: "default",
    },
  );

  const retrospects: Item<RetrospectMeta>[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    // raw content를 가져옴
    const rawContent = module as unknown as string;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    // 파일 경로에서 정보 추출
    // filePath 예: "../contents/retrospect/test.mdx"
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");

    // "retrospect" 디렉토리명 찾기 (contents 다음 디렉토리)
    const contentsIndex = pathParts.findIndex((part) => part === "contents");
    const categoryDir =
      contentsIndex >= 0 && contentsIndex < pathParts.length - 1
        ? pathParts[contentsIndex + 1]
        : "retrospect";

    // slug 생성: "blog/retrospect/test" 형태
    const defaultSlug = `blog/${categoryDir}/${fileNameWithoutExt}`;
    const slug = (frontmatter.slug as string) || defaultSlug;

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    const meta: RetrospectMeta = {
      title: (frontmatter.title as string) || fileNameWithoutExt,
      id: fileNameWithoutExt, // 파일명에서 확장자 제거한 값
      ...frontmatter,
      slug,
      path: relativePath,
    };

    retrospects.push({
      slug,
      content,
      meta,
    });
  }

  return retrospects;
}

/**
 * 특정 slug의 회고를 가져오는 함수
 *
 * @param slug 회고의 slug
 * @returns 회고 정보 (Item 형태), 없으면 undefined
 *
 * @example
 * ```tsx
 * import { getRetrospect } from '../service/retrospects';
 *
 * function RetrospectDetailPage({ slug }: { slug: string }) {
 *   const retrospect = getRetrospect(slug);
 *   if (!retrospect) return <div>회고를 찾을 수 없습니다.</div>;
 *
 *   return (
 *     <div>
 *       <h1>{retrospect.meta.title}</h1>
 *       <div>{retrospect.content}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function getRetrospect(slug: string): Item<RetrospectMeta> | undefined {
  const retrospects = getAllRetrospects();

  return retrospects.find((retrospect) => retrospect.meta.id === slug);
}
