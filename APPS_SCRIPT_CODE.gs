/** Code.gs — 전역 스코프 */

const GA4_PROPERTY_ID = 504634186; // GA4 '속성 ID' 숫자

/** JSON or JSONP 응답 헬퍼 */
function respond(json, cb) {
  if (cb) {
    // JSONP 응답: callback 함수로 감싸서 반환
    return ContentService.createTextOutput(`${cb}(${json})`).setMimeType(
      ContentService.MimeType.JAVASCRIPT,
    );
  }
  // 일반 JSON 응답
  return ContentService.createTextOutput(json).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** 엔드포인트 */
function doGet(e) {
  const p = e?.parameter || {};

  // 파라미터 파싱
  const scope = (p.scope || "page").toLowerCase(); // "page" | "prefix" | "site"
  const path = p.path || "";
  const start = p.start || "30daysAgo";
  const end = p.end || "today";
  const cb = p.callback; // JSONP 콜백 함수명

  // GA4 메트릭 설정
  const metrics = [
    { name: "screenPageViews" }, // 페이지 조회수
    { name: "totalUsers" }, // 총 사용자 수
  ];

  // 기본 요청 구조
  const request = {
    dateRanges: [{ startDate: start, endDate: end }],
    metrics,
    metricAggregations: ["TOTAL"], // 전체 합계 계산
    limit: 10000, // 한 번에 최대 10,000개 행 가져오기
  };

  // ⬇️ 변경: scope가 "site"일 때도 dimensions를 포함하여 전체 페이지 리스트 반환
  // 모든 scope에서 dimensions를 포함하도록 수정
  request.dimensions = [{ name: "pagePath" }];

  // scope에 따라 필터 설정
  if (scope === "page" && path) {
    // 단일 페이지: 정확히 일치하는 경로만
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "EXACT", value: path },
      },
    };
  } else if (scope === "prefix" && path) {
    // 접두어 매칭: 지정된 경로로 시작하는 모든 페이지
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "BEGINS_WITH", value: path },
      },
    };
  }
  // scope === "site"일 때는 dimensionFilter를 설정하지 않음
  // → 모든 페이지를 반환 (전체 페이지 리스트)

  try {
    // 모든 페이지를 가져오기 위해 반복 호출
    let allRows = [];
    let nextPageToken = null;
    let totals = null;
    let isFirstPage = true;

    do {
      // 현재 요청에 nextPageToken 설정 (두 번째 페이지부터)
      const currentRequest = { ...request };
      if (nextPageToken) {
        currentRequest.offset = parseInt(nextPageToken, 10) || 0;
      }

      // GA4 API 호출
      const res = AnalyticsData.Properties.runReport(
        currentRequest,
        `properties/${GA4_PROPERTY_ID}`,
      );

      // 첫 번째 호출에서만 totals 가져오기
      if (isFirstPage) {
        totals = {
          screenPageViews: Number(
            res.totals?.[0]?.metricValues?.[0]?.value || 0,
          ),
          totalUsers: Number(res.totals?.[0]?.metricValues?.[1]?.value || 0),
        };
        isFirstPage = false;
      }

      // 현재 페이지의 rows 추가
      const currentRows = (res.rows || []).map((r) => ({
        path: r.dimensionValues?.[0]?.value || "",
        views: Number(r.metricValues?.[0]?.value || 0),
        users: Number(r.metricValues?.[1]?.value || 0),
      }));

      allRows = allRows.concat(currentRows);

      // 다음 페이지 토큰 확인
      // GA4 API는 nextPageToken이 있으면 다음 페이지가 있음
      nextPageToken = res.nextPageToken || null;

      // 안전장치: 최대 100페이지까지만 가져오기 (1,000,000개 행)
      if (allRows.length >= 1000000) {
        break;
      }
    } while (nextPageToken);

    // 성공 응답 반환 (모든 데이터 포함)
    return respond(JSON.stringify({ ok: true, totals, rows: allRows }), cb);
  } catch (err) {
    // 에러 응답 반환
    return respond(JSON.stringify({ ok: false, error: String(err) }), cb);
  }
}
