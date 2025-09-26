import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import type { ProjectMeta } from "../../../service/portfolio";
import { filterProjects } from "../utils/filters";

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

  // 필터링된 프로젝트 목록
  const filtered = useMemo(() => {
    if (!portfolioIndex) return [];
    return filterProjects(portfolioIndex.all, qText, tag, proj);
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
