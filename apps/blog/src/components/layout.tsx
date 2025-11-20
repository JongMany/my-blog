import React from "react";
import { Outlet } from "react-router-dom";
import CategoryNavigation from "./category-navigation";

export default function Layout() {
  return (
    <div className="px-2.5">
      {/* 카테고리 네비게이션 */}
      <CategoryNavigation />

      {/* 메인 콘텐츠 영역 */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
