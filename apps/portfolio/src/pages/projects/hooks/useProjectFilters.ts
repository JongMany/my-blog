import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import type { ProjectMeta } from "../../../service/portfolio";

export function useProjectFilters(
  portfolioIndex: { all: ProjectMeta[] } | undefined,
) {
  const [sp, setSp] = useSearchParams();

  // URL 파라미터
  const initialQ = useMemo(() => sp.get("q") ?? "", [sp]);
  const tag = sp.get("tag") ?? "";
  const proj = sp.get("proj") ?? "";

  // 검색 텍스트(필터링용 로컬 상태)
  const [qText, setQText] = useState(initialQ);

  // URL 파라미터 관리 함수들
  const setParam = useCallback(
    (key: string, value?: string) => {
      const n = new URLSearchParams(sp);
      if (value && value.length) n.set(key, value);
      else n.delete(key);
      setSp(n, { replace: true });
    },
    [sp, setSp],
  );

  const toggleParam = useCallback(
    (key: string, value: string) => {
      const cur = sp.get(key) ?? "";
      setParam(key, cur === value ? undefined : value);
    },
    [sp, setParam],
  );

  // 필터링 로직
  const includesI = (s: string | undefined | null, q: string) =>
    (s ?? "").toLowerCase().includes(q.toLowerCase());

  const filtered = useMemo(() => {
    if (!portfolioIndex) return [];
    const q = qText.trim();
    return portfolioIndex.all.filter((p) => {
      const qHit =
        !q ||
        includesI(p.title, q) ||
        includesI(p.summary, q) ||
        includesI(p.project ?? "", q);
      const tHit = !tag || (p.tags ?? []).includes(tag);
      const pHit = !proj || p.project === proj;
      return qHit && tHit && pHit;
    });
  }, [portfolioIndex, qText, tag, proj]);

  return {
    // 상태
    searchQuery: qText, // 실제 필터링에 사용되는 값으로 변경
    selectedTag: tag,
    selectedProject: proj,
    filteredProjects: filtered,

    // 액션
    setSearchText: setQText,
    setSearchCommit: (value: string) => setParam("q", value || undefined),
    setTag: (tag: string) => toggleParam("tag", tag),
    setProject: (project: string) => toggleParam("proj", project),
    clearTag: () => setParam("tag"),
    clearProject: () => setParam("proj"),
  };
}
