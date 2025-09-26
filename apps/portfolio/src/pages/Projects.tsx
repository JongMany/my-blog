// apps/portfolio/src/pages/Projects.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { usePortfolioIndex } from "../service/portfolio";
import { ProjectCard } from "../components/project-card";
import { motion } from "framer-motion";
import { stagger } from "../components/motion";

/** -------- IME 안전 SearchBox (URL과 완전 분리) -------- */
const SearchBox = React.memo(function SearchBox({
  initial,
  onChangeText,
  onCommit, // Enter/Blur 시 URL 반영 콜백
}: {
  initial: string;
  onChangeText: (v: string) => void;
  onCommit: (v: string) => void;
}) {
  const [value, setValue] = React.useState(initial);
  const composingRef = React.useRef(false);

  // 로컬 값이 바뀌면 필터링에만 반영 (URL은 건드리지 않음)
  React.useEffect(() => {
    onChangeText(value);
  }, [value, onChangeText]);

  return (
    <div className="flex items-center gap-2">
      <input
        className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
        placeholder="검색(제목/요약/프로젝트명)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onCompositionStart={() => (composingRef.current = true)}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          setValue(e.currentTarget.value); // 조합 종료 후 최종 문자열 유지
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !composingRef.current) {
            onCommit(value); // Enter 시에만 URL 반영
          }
        }}
        onBlur={() => {
          if (!composingRef.current) onCommit(value); // Blur 시 URL 반영
        }}
        lang="ko"
        inputMode="text"
        autoComplete="off"
      />
      {value && (
        <button className="t-btn text-xs" onClick={() => setValue("")}>
          지우기
        </button>
      )}
    </div>
  );
});

export default function Projects() {
  const [sp, setSp] = useSearchParams();
  const { data: portfolioIndex, isLoading } = usePortfolioIndex();

  // URL 파라미터(초기화용만 사용)
  const initialQ = React.useMemo(() => sp.get("q") ?? "", []); // 최초 1회만
  const tag = sp.get("tag") ?? "";
  const proj = sp.get("proj") ?? "";

  // 검색 텍스트(필터링용 로컬 상태)
  const [qText, setQText] = React.useState(initialQ);

  const setParam = React.useCallback(
    (key: string, value?: string) => {
      const n = new URLSearchParams(sp);
      if (value && value.length) n.set(key, value);
      else n.delete(key);
      setSp(n, { replace: true });
    },
    [sp, setSp],
  );
  const toggleParam = React.useCallback(
    (key: string, value: string) => {
      const cur = sp.get(key) ?? "";
      setParam(key, cur === value ? undefined : value);
    },
    [sp, setParam],
  );

  // 태그/프로젝트 목록
  const allTags = React.useMemo(
    () =>
      Array.from(
        new Set(portfolioIndex?.all.flatMap((p) => p.tags) ?? []),
      ).sort(),
    [portfolioIndex],
  );
  const allProjects = React.useMemo(
    () =>
      Array.from(
        new Set(
          (portfolioIndex?.all
            .map((p) => p.project)
            .filter(Boolean) as string[]) ?? [],
        ),
      ).sort(),
    [portfolioIndex],
  );

  const includesI = (s: string | undefined | null, q: string) =>
    (s ?? "").toLowerCase().includes(q.toLowerCase());

  const filtered = React.useMemo(() => {
    if (!portfolioIndex) return [];
    const q = qText.trim();
    return portfolioIndex.all.filter((p) => {
      const qHit =
        !q ||
        includesI(p.title, q) ||
        includesI(p.summary, q) ||
        includesI(p.project ?? "", q); // ← project명 기준 포함
      const tHit = !tag || (p.tags ?? []).includes(tag);
      const pHit = !proj || p.project === proj;
      return qHit && tHit && pHit;
    });
  }, [portfolioIndex, qText, tag, proj]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-[var(--muted-fg)]">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="t-card flex flex-col gap-3 p-3">
          {/* 검색 인풋: 로컬 필터링 + Enter/Blur에만 URL 반영 */}
          <SearchBox
            initial={initialQ}
            onChangeText={setQText}
            onCommit={(v) => setParam("q", v || undefined)}
          />

          {/* 프로젝트 칩 필터 (즉시 URL 반영: IME와 무관) */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`t-chip ${!proj ? "ring-1 ring-[var(--primary)]" : ""}`}
              onClick={() => setParam("proj")}
            >
              모든 프로젝트
            </button>
            {allProjects.map((pname) => {
              const active = proj === pname;
              return (
                <button
                  key={pname}
                  className={`t-chip ${
                    proj === pname ? "ring-1 ring-[var(--primary)]" : ""
                  }`}
                  onClick={() => toggleParam("proj", pname)}
                  aria-pressed={active}
                >
                  {pname}
                </button>
              );
            })}
          </div>

          {/* 태그 칩 필터 */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`t-chip ${!tag ? "ring-1 ring-[var(--primary)]" : ""}`}
              onClick={() => setParam("tag")}
            >
              전체 태그
            </button>
            {allTags.map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t}
                  className={`t-chip ${active ? "ring-1 ring-[var(--primary)]" : ""}`}
                  onClick={() => toggleParam("tag", t)}
                  aria-pressed={active}
                >
                  #{t}
                </button>
              );
            })}
          </div>
        </div>

        {/* 결과 리스트 */}
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
