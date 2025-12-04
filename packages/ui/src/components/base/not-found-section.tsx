import type { ReactNode } from "react";

interface NotFoundSectionProps {
  /**
   * 404 이미지 소스 URL
   */
  illustrationSrc: string;
  /**
   * 돌아가기 링크를 렌더링하는 함수
   * 스타일링과 링크 경로, 텍스트는 이 함수 내부에서 처리해야 합니다.
   */
  renderLink: () => ReactNode;
  /**
   * 제목 텍스트
   * @default "페이지를 찾을 수 없습니다"
   */
  title?: string;
  /**
   * 설명 텍스트
   * @default "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
   */
  description?: string;
}

/**
 * 404 Not Found 섹션 컴포넌트
 *
 * @example
 * ```tsx
 * <NotFoundSection
 *   illustrationSrc={imageSource("/404.svg", "blog", { isDevelopment })}
 *   renderLink={() => (
 *     <Link
 *       to="/blog/posts"
 *       className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
 *     >
 *       블로그로 돌아가기
 *     </Link>
 *   )}
 * />
 * ```
 */
export function NotFoundSection({
  illustrationSrc,
  renderLink,
  title = "페이지를 찾을 수 없습니다",
  description = "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
}: NotFoundSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <img
        src={illustrationSrc}
        alt="404 Not Found"
        className="w-full h-auto max-w-md"
        // style={{ maxWidth: "200px" }}
      />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        {renderLink()}
      </div>
    </div>
  );
}
