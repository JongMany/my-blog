import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface Category {
  path: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { path: "/blog/posts", label: "개발" },
  { path: "/blog/retrospect", label: "회고" },
  { path: "/blog/books", label: "읽은책" },
  { path: "/blog/logs", label: "기록" },
];

export default function CategoryNavigation() {
  const location = useLocation();

  return (
    <nav className="mb-6">
      <div className="flex items-center gap-8">
        {CATEGORIES.map((category) => {
          const isActive = location.pathname.startsWith(category.path);

          return (
            <NavLink
              key={category.path}
              to={category.path}
              className={({ isActive: navIsActive }) => {
                const active = navIsActive || isActive;
                return [
                  "relative text-sm transition-all duration-200",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gray-900 after:transition-all after:duration-200",
                  "dark:after:bg-gray-100",
                  active
                    ? "font-semibold text-gray-900 dark:text-gray-100 after:w-full"
                    : "font-normal text-gray-600 hover:text-gray-900 hover:after:w-full dark:text-gray-400 dark:hover:text-gray-200",
                ].join(" ");
              }}
            >
              {category.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
