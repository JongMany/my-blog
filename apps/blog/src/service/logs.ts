import { LogMeta, Item } from "@/types/contents/log";
import { parseFrontmatter } from "@/utils/frontmatter";

/**
 * 모든 로그 목록을 가져오는 함수 (Item 형태)
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
 * import { getLogs } from '../service/logs';
 *
 * function LogsPage() {
 *   const logs = getLogs();
 *   return <div>{logs.map(log => (
 *     <div key={log.slug}>
 *       <h2>{log.meta.title}</h2>
 *       <p>{log.meta.summary}</p>
 *     </div>
 *   ))}</div>;
 * }
 * ```
 */
export function getLogs(): Item<LogMeta>[] {
  return getAllLogs();
}

/**
 * 모든 로그를 Item 형태로 가져오는 함수 (내부 함수)
 */
function getAllLogs(): Item<LogMeta>[] {
  // ⚠️ Vite는 리터럴 문자열만 허용하므로, 이 파일 위치 기준 상대 경로를 직접 사용
  const modules = import.meta.glob<string>("../contents/logs/**/*.{md,mdx}", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const logs: Item<LogMeta>[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    // raw content를 가져옴
    const rawContent = module as unknown as string;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    // 파일 경로에서 정보 추출
    // filePath 예: "../contents/logs/test.mdx"
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");

    // "logs" 디렉토리명 찾기 (contents 다음 디렉토리)
    const contentsIndex = pathParts.findIndex((part) => part === "contents");
    const categoryDir =
      contentsIndex >= 0 && contentsIndex < pathParts.length - 1
        ? pathParts[contentsIndex + 1]
        : "logs";

    // slug 생성: "blog/logs/test" 형태
    const defaultSlug = `blog/${categoryDir}/${fileNameWithoutExt}`;
    const slug = (frontmatter.slug as string) || defaultSlug;

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    const meta: LogMeta = {
      title: (frontmatter.title as string) || fileNameWithoutExt,
      id: fileNameWithoutExt, // 파일명에서 확장자 제거한 값
      ...frontmatter,
      slug,
      path: relativePath,
    };

    logs.push({
      slug,
      content,
      meta,
    });
  }

  return logs;
}

/**
 * 특정 slug의 로그를 가져오는 함수
 *
 * @param slug 로그의 slug
 * @returns 로그 정보 (Item 형태), 없으면 undefined. published가 false인 로그는 반환하지 않습니다.
 *
 * @example
 * ```tsx
 * import { getLog } from '../service/logs';
 *
 * function LogDetailPage({ slug }: { slug: string }) {
 *   const log = getLog(slug);
 *   if (!log) return <div>로그를 찾을 수 없습니다.</div>;
 *
 *   return (
 *     <div>
 *       <h1>{log.meta.title}</h1>
 *       <div>{log.content}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function getLog(slug: string): Item<LogMeta> | undefined {
  const logs = getAllLogs();

  const log = logs.find((log) => log.meta.id === slug);
  
  // published가 false인 로그는 반환하지 않음
  if (log && log.meta.published === false) {
    return undefined;
  }

  return log;
}

