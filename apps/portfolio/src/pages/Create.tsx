// apps/portfolio/src/pages/PortfolioAdmin.tsx
import * as React from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import ProjectForm from "../components/form";
import { Link } from "react-router-dom";

export default function PortfolioCreate() {
  const { items, remove } = usePortfolioStore();

  const [editing, setEditing] = React.useState<string | null>(null);
  const target = editing ? items.find((x) => x.slug === editing) : undefined;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-xl font-semibold">Portfolio Admin</h1>
        <p className="mt-1 text-sm text-[var(--muted-fg)]">
          아이템을 생성/수정/삭제하고, 즉시 목록/상세에 반영됩니다.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 좌: 폼 */}
        <div className="t-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="font-medium">{target ? "수정" : "새 아이템"}</div>
            {target && (
              <span className="text-xs text-[var(--muted-fg)]">
                ({target.slug})
              </span>
            )}
            <button
              onClick={() => setEditing(null)}
              className="ml-auto rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]"
            >
              새로 만들기
            </button>
          </div>
          <ProjectForm
            initial={target}
            onDone={() => {
              // 저장 후 폼 닫거나 유지하고 싶은 동작 선택
              setEditing(null);
            }}
          />
        </div>

        {/* 우: 목록 */}
        <div className="t-card p-4">
          <div className="mb-2 font-medium">Items</div>
          <ul className="divide-y divide-[var(--border)]">
            {items.length === 0 && (
              <li className="py-6 text-sm text-[var(--muted-fg)]">
                아직 아이템이 없습니다.
              </li>
            )}
            {items.map((p) => (
              <li key={p.slug} className="flex items-center gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.title}</div>
                  <div className="truncate text-xs text-[var(--muted-fg)]">
                    {p.slug}
                  </div>
                </div>
                {p.pinned && <span className="t-chip text-[10px]">Pinned</span>}
                <Link
                  to={`/project/${p.slug}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs hover:bg-[var(--hover-bg)]"
                  target="_blank"
                  rel="noreferrer"
                  title="상세 보기"
                >
                  보기 ↗
                </Link>
                <button
                  onClick={() => setEditing(p.slug)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs hover:bg-[var(--hover-bg)]"
                >
                  수정
                </button>
                <button
                  onClick={() => confirm("삭제할까요?") && remove(p.slug)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs text-red-500 hover:bg-[var(--hover-bg)]"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
