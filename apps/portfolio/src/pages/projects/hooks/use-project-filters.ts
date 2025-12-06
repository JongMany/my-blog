import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState, useEffect } from "react";
import type { ProjectIndex } from "@/entities/project";
import { filterProjects } from "@/entities/project/utils";
import {
  createUpdateSearchParam,
  createToggleSearchParam,
} from "@/utils/search-params";
import {
  getTagsForSelectedProject,
  isValidTagForProject,
} from "@/pages/projects/utils/filter-helpers";
import { URL_PARAM_KEYS } from "@/constants/url-params";

export function useProjectFilters(
  portfolioIndex: ProjectIndex | undefined,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 읽은 값들
  const searchQueryFromUrl = searchParams.get(URL_PARAM_KEYS.SEARCH) ?? "";
  const selectedTag = searchParams.get(URL_PARAM_KEYS.TAG) ?? "";
  const selectedProject = searchParams.get(URL_PARAM_KEYS.PROJECT) ?? "";

  // 검색 입력을 위한 로컬 상태 (실시간 필터링용)
  const [searchInputValue, setSearchInputValue] = useState(searchQueryFromUrl);

  // URL 파라미터가 변경되면 로컬 상태 동기화
  useEffect(() => {
    setSearchInputValue(searchQueryFromUrl);
  }, [searchQueryFromUrl]);

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
      updateSearchParam(URL_PARAM_KEYS.TAG);
    }
  }, [selectedProject, selectedTag, portfolioIndex, updateSearchParam]);

  // 모든 필터 초기화
  const clearAllFilters = useCallback(() => {
    const filterParamKeys = [
      URL_PARAM_KEYS.SEARCH,
      URL_PARAM_KEYS.TAG,
      URL_PARAM_KEYS.PROJECT,
    ];

    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        filterParamKeys.forEach((key) => newParams.delete(key));
        return newParams;
      },
      { replace: true },
    );
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
    commitSearch: (value: string) => updateSearchParam(URL_PARAM_KEYS.SEARCH, value),
    setTag: (tag: string) => toggleSearchParam(URL_PARAM_KEYS.TAG, tag),
    setProject: (project: string) =>
      toggleSearchParam(URL_PARAM_KEYS.PROJECT, project),
    clearTag: () => updateSearchParam(URL_PARAM_KEYS.TAG),
    clearProject: () => updateSearchParam(URL_PARAM_KEYS.PROJECT),
    clearAllFilters,
  };
}
