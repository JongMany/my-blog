import { useParams } from "react-router-dom";
import { GaCounters } from "./GaCounter";

export default function CategoryPage() {
  const { slug } = useParams(); // e.g. "frontend"
  const prefix = `/blog/${slug}/`; // 그 카테고리의 모든 글 경로 공통 접두어

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold">{slug}</h1>
      <GaCounters
        api={import.meta.env.VITE_GA_API_URL}
        scope="prefix"
        path={prefix}
        start="30daysAgo" // 최근 30일 합계
      />
    </div>
  );
}
