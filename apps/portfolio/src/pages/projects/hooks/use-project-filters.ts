import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState, useEffect } from "react";
import type { ProjectMeta } from "../../../entities/project";
import { filterProjects } from "../../../entities/project/utils";
import {
  createUpdateSearchParam,
  createToggleSearchParam,
} from "../../../utils/search-params";

const SEARCH_PARAM_KEY = "q";
const TAG_PARAM_KEY = "tag";
const PROJECT_PARAM_KEY = "proj";

export function useProjectFilters(
  portfolioIndex: { all: ProjectMeta[] } | undefined,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 읽은 값들
  const urlSearchQuery = searchParams.get(SEARCH_PARAM_KEY) ?? "";
  const selectedTag = searchParams.get(TAG_PARAM_KEY) ?? "";
  const selectedProject = searchParams.get(PROJECT_PARAM_KEY) ?? "";

  // 검색 입력을 위한 로컬 상태 (실시간 필터링용)
  const [searchInputValue, setSearchInputValue] = useState(urlSearchQuery);

  // URL 파라미터가 변경되면 로컬 상태 동기화
  useEffect(() => {
    setSearchInputValue(urlSearchQuery);
  }, [urlSearchQuery]);

  // URL 파라미터 업데이트 헬퍼
  const updateSearchParam = useCallback(
    createUpdateSearchParam(setSearchParams),
    [setSearchParams],
  );

  // 토글 파라미터 헬퍼
  const toggleSearchParam = useCallback(
    createToggleSearchParam(setSearchParams),
    [setSearchParams],
  );

  // 필터링된 프로젝트 목록
  const filteredProjects = useMemo(() => {
    if (!portfolioIndex) return [];
    return filterProjects(portfolioIndex.all, {
      searchQuery: searchInputValue,
      selectedTag,
      selectedProject,
    });
  }, [portfolioIndex, searchInputValue, selectedTag, selectedProject]);

  return {
    // 상태
    searchQuery: searchInputValue,
    selectedTag,
    selectedProject,
    filteredProjects,

    // 액션
    setSearchText: setSearchInputValue,
    commitSearch: (value: string) => updateSearchParam(SEARCH_PARAM_KEY, value),
    setTag: (tag: string) => toggleSearchParam(TAG_PARAM_KEY, tag),
    setProject: (project: string) =>
      toggleSearchParam(PROJECT_PARAM_KEY, project),
    clearTag: () => updateSearchParam(TAG_PARAM_KEY),
    clearProject: () => updateSearchParam(PROJECT_PARAM_KEY),
  };
}
