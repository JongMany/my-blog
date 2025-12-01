import type { AnalyticsPageData } from "../hooks/use-ga-counters";
import { requestJsonp } from "./jsonp";

// Analytics API 응답 타입
type AnalyticsApiResponse = {
  ok: boolean;
  rows?: AnalyticsPageData[];
  error?: string;
};

/**
 * 전체 사이트 Analytics 데이터 가져오기
 *
 * @param apiUrl - Analytics API URL
 * @returns Analytics 페이지 데이터 배열
 * @throws Error - API URL이 설정되지 않았거나 API 호출 실패 시
 */
export async function fetchAllSiteAnalytics(
  apiUrl: string,
): Promise<AnalyticsPageData[]> {
  if (!apiUrl) {
    throw new Error("API URL이 설정되지 않았습니다");
  }

  const url = new URL(apiUrl);
  url.searchParams.set("scope", "site");
  url.searchParams.set("start", "30daysAgo");
  url.searchParams.set("end", "today");

  const data = await requestJsonp<AnalyticsApiResponse>(url.toString());

  if (!data.ok) {
    throw new Error(data.error || "API 오류");
  }

  return (data.rows || []).filter((pageData: AnalyticsPageData) =>
    pageData.path.startsWith("/my-blog"),
  );
}

