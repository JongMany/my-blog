import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="space-y-6">
      {/* 카테고리 네비게이션 */}
      <div className="flex items-center justify-between gap-3">
        {/* <CategoryNavigation data={data} isLoading={isLoading} /> */}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="t-card p-5">
        <Outlet />
      </div>
    </div>
  );
}
