/**
 * 책 메타데이터 타입
 */
export interface BookMeta {
  title: string;
  author?: string;
  summary?: string;
  tags?: string[];
  date?: string;
  slug: string;
  path: string;
  createdAtMs?: number;
  [key: string]: unknown; // frontmatter의 추가 필드를 허용
}
