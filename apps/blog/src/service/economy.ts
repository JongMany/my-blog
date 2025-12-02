import { EconomyMeta, Item } from "@/types/contents/economy";
import { parseFrontmatter } from "@/utils/frontmatter";

/**
 * 모든 경제 섹션 콘텐츠 목록을 가져오는 함수 (Item 형태)
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
 * import { getEconomies } from '../service/economy';
 *
 * function EconomyPage() {
 *   const economies = getEconomies();
 *   return <div>{economies.map(economy => (
 *     <div key={economy.slug}>
 *       <h2>{economy.meta.title}</h2>
 *       <p>{economy.meta.summary}</p>
 *     </div>
 *   ))}</div>;
 * }
 * ```
 */
export function getEconomies(): Item<EconomyMeta>[] {
  return getAllEconomies();
}

/**
 * 모든 경제 섹션 콘텐츠를 Item 형태로 가져오는 함수 (내부 함수)
 */
function getAllEconomies(): Item<EconomyMeta>[] {
  // ⚠️ Vite는 리터럴 문자열만 허용하므로, 이 파일 위치 기준 상대 경로를 직접 사용
  const modules = import.meta.glob<string>("../contents/economy/**/*.{md,mdx}", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const economies: Item<EconomyMeta>[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    // raw content를 가져옴
    const rawContent = module as unknown as string;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    // 파일 경로에서 정보 추출
    // filePath 예: "../contents/economy/inflation-analysis.mdx"
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");

    // "economy" 디렉토리명 찾기 (contents 다음 디렉토리)
    const contentsIndex = pathParts.findIndex((part) => part === "contents");
    const categoryDir =
      contentsIndex >= 0 && contentsIndex < pathParts.length - 1
        ? pathParts[contentsIndex + 1]
        : "economy";

    // slug 생성: "blog/economy/inflation-analysis" 형태
    const defaultSlug = `blog/${categoryDir}/${fileNameWithoutExt}`;
    const slug = (frontmatter.slug as string) || defaultSlug;

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    const meta: EconomyMeta = {
      title: (frontmatter.title as string) || fileNameWithoutExt,
      id: fileNameWithoutExt, // 파일명에서 확장자 제거한 값
      ...frontmatter,
      slug,
      path: relativePath,
    };

    economies.push({
      slug,
      content,
      meta,
    });
  }

  return economies;
}

/**
 * 특정 slug의 경제 섹션 콘텐츠를 가져오는 함수
 *
 * @param slug 콘텐츠의 slug
 * @returns 콘텐츠 정보 (Item 형태), 없으면 undefined. published가 false인 콘텐츠는 반환하지 않습니다.
 *
 * @example
 * ```tsx
 * import { getEconomy } from '../service/economy';
 *
 * function EconomyDetailPage({ slug }: { slug: string }) {
 *   const economy = getEconomy(slug);
 *   if (!economy) return <div>콘텐츠를 찾을 수 없습니다.</div>;
 *
 *   return (
 *     <div>
 *       <h1>{economy.meta.title}</h1>
 *       <div>{economy.content}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function getEconomy(slug: string): Item<EconomyMeta> | undefined {
  const economies = getAllEconomies();

  const economy = economies.find((economy) => economy.meta.id === slug);
  
  // published가 false인 콘텐츠는 반환하지 않음
  if (economy && economy.meta.published === false) {
    return undefined;
  }

  return economy;
}

