import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogIndex } from "../../../service/blogData";
import { CategoryNavigation } from "./CategoryNavigation";

// 상수 정의
const STALE_TIME_MS = 60_000; // 1분

// 메인 레이아웃 컴포넌트
export function BlogLayout() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogIndex"],
    queryFn: fetchBlogIndex,
    staleTime: STALE_TIME_MS,
  });

  return (
    <div className="space-y-6">
      {/* 카테고리 네비게이션 */}
      <div className="flex items-center justify-between gap-3">
        <CategoryNavigation data={data} isLoading={isLoading} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="t-card p-5">
        <Outlet />
      </div>
    </div>
  );
}
