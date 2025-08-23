import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "../../service/api";

export default function CategoriesPage() {
  const { data: cats = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  return (
    <div>
      <h3 className="mb-3 text-lg font-medium">카테고리</h3>
      {cats.length === 0 ? (
        <p className="text-sm text-[var(--muted-fg)]">카테고리가 없습니다.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/blog/categories/${c.slug}`}
                className="rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1 text-sm hover:bg-[var(--hover-bg)]"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
