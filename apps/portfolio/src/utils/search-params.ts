import type { SetURLSearchParams } from "react-router-dom";

/**
 * URL Search Params 관련 유틸리티 함수들
 */

/**
 * URL 파라미터를 업데이트하는 헬퍼 함수
 * @param setSearchParams - react-router-dom의 setSearchParams 함수
 * @param key - 업데이트할 파라미터 키
 * @param value - 설정할 값 (undefined이면 삭제)
 */
export function createUpdateSearchParam(
  setSearchParams: SetURLSearchParams,
) {
  return (key: string, value?: string) => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        if (value && value.trim()) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        return newParams;
      },
      { replace: true },
    );
  };
}

/**
 * URL 파라미터를 토글하는 헬퍼 함수
 * @param setSearchParams - react-router-dom의 setSearchParams 함수
 * @param key - 토글할 파라미터 키
 * @param value - 토글할 값 (현재 값과 같으면 삭제)
 */
export function createToggleSearchParam(
  setSearchParams: SetURLSearchParams,
) {
  return (key: string, value: string) => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        const currentValue = newParams.get(key) ?? "";
        const newValue = currentValue === value ? undefined : value;

        if (newValue) {
          newParams.set(key, newValue);
        } else {
          newParams.delete(key);
        }
        return newParams;
      },
      { replace: true },
    );
  };
}

