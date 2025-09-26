// apps/portfolio/src/pages/Projects.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { usePortfolioIndex } from "../../service/portfolio.query";
import {
  LoadingSpinner,
  SearchBox,
  FilterChips,
  ProjectGrid,
} from "../../components/common";
import { ProjectCard } from "../../components/project-card";

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
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="t-card flex flex-col gap-3 p-3">
        {/* 검색 인풋: 로컬 필터링 + Enter/Blur에만 URL 반영 */}
        <SearchBox
          initial={initialQ}
          onChangeText={setQText}
          onCommit={(v) => setParam("q", v || undefined)}
        />

        {/* 프로젝트 칩 필터 */}
        <FilterChips
          items={allProjects}
          activeItem={proj}
          onItemClick={(item) => toggleParam("proj", item)}
          onClearClick={() => setParam("proj")}
          clearLabel="모든 프로젝트"
        />

        {/* 태그 칩 필터 */}
        <FilterChips
          items={allTags}
          activeItem={tag}
          onItemClick={(item) => toggleParam("tag", item)}
          onClearClick={() => setParam("tag")}
          clearLabel="전체 태그"
          itemPrefix="#"
        />
      </div>

      {/* 결과 리스트 */}
      <ProjectGrid
        projects={filtered}
        emptyMessage="조건에 맞는 프로젝트가 없습니다."
        renderProject={(project) => <ProjectCard p={project} />}
      />
    </div>
  );
}
