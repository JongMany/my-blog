// apps/portfolio/src/pages/Projects.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { projects } from "../service/portfolio";
import ProjectCard from "../components/ProjectCard";
import { motion } from "framer-motion";
import { stagger } from "../components/Motion";

export default function Projects() {
  const allTags = React.useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))).sort(),
    []
  );
  const [sp, setSp] = useSearchParams();
  const q = (sp.get("q") ?? "").toLowerCase();
  const tag = sp.get("tag") ?? "";

  const filtered = projects.filter((p) => {
    const qHit =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);
    const tHit = !tag || p.tags.includes(tag);
    return qHit && tHit;
  });

  return (
    <Layout>
      <div className="space-y-4">
        <div className="t-card flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <input
              className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="검색(제목/요약)"
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                const n = new URLSearchParams(sp);
                v ? n.set("q", v) : n.delete("q");
                setSp(n, { replace: true });
              }}
            />
            {q && (
              <button
                className="t-btn text-xs"
                onClick={() => {
                  const n = new URLSearchParams(sp);
                  n.delete("q");
                  setSp(n, { replace: true });
                }}
              >
                지우기
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`t-chip ${!tag ? "ring-1 ring-[var(--primary)]" : ""}`}
              onClick={() => {
                const n = new URLSearchParams(sp);
                n.delete("tag");
                setSp(n, { replace: true });
              }}
            >
              전체
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                className={`t-chip ${tag === t ? "ring-1 ring-[var(--primary)]" : ""}`}
                onClick={() => {
                  const n = new URLSearchParams(sp);
                  n.set("tag", t);
                  setSp(n, { replace: true });
                }}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-[var(--muted-fg)]">
              조건에 맞는 프로젝트가 없습니다.
            </div>
          )}
        </motion.ul>
      </div>
    </Layout>
  );
}
