// apps/blog/src/pages/home/BlogHome.tsx
import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogIndexFromHost, type BlogIndex } from "../../service/blogData";

export default function BlogHome() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogIndex"],
    queryFn: fetchBlogIndexFromHost,
  });

  if (isLoading) return <div>불러오는 중…</div>;
  if (error || !data) return <div>로드 실패</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <nav className="mt-4 flex flex-wrap gap-2">
        <NavLink
          to="all"
          className={({ isActive }) =>
            `px-3 py-1 rounded ${isActive ? "bg-white text-black" : "border border-white/20"}`
          }
        >
          전체
        </NavLink>
        {/* {data.categories.map((c) => (
          <NavLink
            key={c}
            to={`c/${c}`}
            className={({ isActive }) =>
              `px-3 py-1 rounded ${isActive ? "bg-white text-black" : "border border-white/20"}`
            }
          >
            {c}
          </NavLink>
        ))} */}
      </nav>
      <div className="mt-6">
        <Outlet context={{ blogIndex: data }} />
      </div>
    </div>
  );
}
