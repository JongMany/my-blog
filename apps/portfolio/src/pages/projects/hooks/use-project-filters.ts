import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState, useEffect } from "react";
import type { ProjectIndex } from "../../../entities/project";
import { filterProjects } from "../../../entities/project/utils";
import {
  createUpdateSearchParam,
  createToggleSearchParam,
} from "../../../utils/search-params";
import {
  getTagsForSelectedProject,
  isValidTagForProject,
} from "../utils/filter-helpers";

const SEARCH_PARAM_KEY = "q";
const TAG_PARAM_KEY = "tag";
const PROJECT_PARAM_KEY = "proj";

export function useProjectFilters(
  portfolioIndex: ProjectIndex | undefined,
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

  // 프로젝트 목록
  const allProjects = useMemo(
    () => portfolioIndex?.projects ?? [],
    [portfolioIndex],
  );

  // 선택된 프로젝트에 따라 사용 가능한 태그 목록
  const availableTags = useMemo(
    () => getTagsForSelectedProject(portfolioIndex, selectedProject),
    [portfolioIndex, selectedProject],
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

  // 선택된 태그가 새로운 프로젝트에 없으면 태그 초기화
  useEffect(() => {
    if (!isValidTagForProject(portfolioIndex, selectedProject, selectedTag)) {
      updateSearchParam(TAG_PARAM_KEY);
    }
  }, [selectedProject, selectedTag, portfolioIndex, updateSearchParam]);

  // 모든 필터 초기화
  const clearAllFilters = useCallback(() => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.delete(SEARCH_PARAM_KEY);
        newParams.delete(TAG_PARAM_KEY);
        newParams.delete(PROJECT_PARAM_KEY);
        return newParams;
      },
      { replace: true },
    );
    // URL 파라미터가 삭제되면 useEffect가 자동으로 searchInputValue를 업데이트함
    // 하지만 즉시 반영을 위해 여기서도 설정
    setSearchInputValue("");
  }, [setSearchParams]);

  return {
    // 상태
    searchQuery: searchInputValue,
    selectedTag,
    selectedProject,
    filteredProjects,
    allProjects,
    availableTags,

    // 액션
    setSearchText: setSearchInputValue,
    commitSearch: (value: string) => updateSearchParam(SEARCH_PARAM_KEY, value),
    setTag: (tag: string) => toggleSearchParam(TAG_PARAM_KEY, tag),
    setProject: (project: string) =>
      toggleSearchParam(PROJECT_PARAM_KEY, project),
    clearTag: () => updateSearchParam(TAG_PARAM_KEY),
    clearProject: () => updateSearchParam(PROJECT_PARAM_KEY),
    clearAllFilters,
  };
}
