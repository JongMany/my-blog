import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogIndexFromHost, type BlogIndex } from "../service/blogData";
import { cn } from "@srf/ui";

// 상수 정의
const STALE_TIME_MS = 60_000; // 1분
const LOADING_INDICATOR = "…";

// 스타일 관련 상수
const CATEGORY_PILL_BASE_CLASSES =
  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition border";
const CATEGORY_PILL_ACTIVE_CLASSES =
  "bg-[var(--primary)] text-[var(--primary-ink)] border-[var(--primary)]";
const CATEGORY_PILL_INACTIVE_CLASSES =
  "border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]";
const COUNT_BADGE_CLASSES = "rounded-full bg-black/20 px-2 py-0.5 text-xs";

// 카테고리 아이템 컴포넌트
interface CategoryItemProps {
  category: string;
  count: number;
  to: string;
}

function CategoryItem({ category, count, to }: CategoryItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          CATEGORY_PILL_BASE_CLASSES,
          isActive
            ? CATEGORY_PILL_ACTIVE_CLASSES
            : CATEGORY_PILL_INACTIVE_CLASSES,
        )
      }
    >
      {category}
      <span className={COUNT_BADGE_CLASSES}>{count}</span>
    </NavLink>
  );
}

// 전체 카테고리 아이템 컴포넌트
interface AllCategoryItemProps {
  totalCount: number;
  isLoading: boolean;
}

function AllCategoryItem({ totalCount, isLoading }: AllCategoryItemProps) {
  return (
    <NavLink
      to="/blog"
      end
      className={({ isActive }) =>
        cn(
          CATEGORY_PILL_BASE_CLASSES,
          isActive
            ? CATEGORY_PILL_ACTIVE_CLASSES
            : CATEGORY_PILL_INACTIVE_CLASSES,
        )
      }
    >
      전체
      <span className={COUNT_BADGE_CLASSES}>
        {isLoading ? LOADING_INDICATOR : totalCount}
      </span>
    </NavLink>
  );
}

// 카테고리 네비게이션 컴포넌트
interface CategoryNavigationProps {
  data: BlogIndex | undefined;
  isLoading: boolean;
}

function CategoryNavigation({ data, isLoading }: CategoryNavigationProps) {
  if (isLoading || !data) {
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-2">
          <AllCategoryItem totalCount={0} isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <AllCategoryItem totalCount={data.all.length} isLoading={false} />

        {data.categories.map((category: string) => {
          const count = data.byCategory[category]?.length ?? 0;
          const encodedCategory = encodeURIComponent(category);

          return (
            <CategoryItem
              key={category}
              category={category}
              count={count}
              to={`/blog/c/${encodedCategory}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// 메인 레이아웃 컴포넌트
export default function BlogLayout() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogIndex"],
    queryFn: fetchBlogIndexFromHost,
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
