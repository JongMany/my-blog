import { GaCounters } from "@mfe/shared/GaCounters";

export default function PostDetail() {
  // ...본문/렌더
  return (
    <div className="space-y-4">
      {/* 제목/메타들 */}
      <GaCounters
        api={import.meta.env.VITE_GA_API_URL}
        scope="page" // 기본값이라 안 써도 됨
        // path 생략 시 현재 location.pathname 사용
        start="2024-01-01" // “사실상 전체기간”으로 보고 싶다면
      />
      {/* 글 내용 */}
    </div>
  );
}
