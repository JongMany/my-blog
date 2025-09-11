// @mfe/shared/GaCounters.tsx
import * as React from "react";

type Props = {
  api: string; // Apps Script 웹앱 URL
  scope?: "page" | "prefix" | "site";
  path?: string; // scope=page/prefix일 때 대상 경로
  start?: string; // 기본 "30daysAgo"
  end?: string; // 기본 "today"
  className?: string;
};

export function GaCounters({
  api,
  scope = "page",
  path,
  start = "30daysAgo",
  end = "today",
  className,
}: Props) {
  const [data, setData] = React.useState<{
    views: number;
    users: number;
  } | null>(null);

  // path 안 주면 자동으로 현재 URL 사용 (site 제외)
  const resolvedPath =
    scope === "site"
      ? undefined
      : (path ??
        (typeof window !== "undefined" ? window.location.pathname : "/"));

  React.useEffect(() => {
    if (!api) return;

    const u = new URL(api);
    u.searchParams.set("scope", scope);
    if (resolvedPath) u.searchParams.set("path", resolvedPath);
    u.searchParams.set("start", start);
    u.searchParams.set("end", end);

    // 1) CORS 허용이면 JSON, 아니면 자동 JSONP 폴백
    fetch(u.toString())
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) =>
        setData({
          views: Number(j?.totals?.screenPageViews || 0),
          users: Number(j?.totals?.totalUsers || 0),
        }),
      )
      .catch(() => {
        const cb = "__ga_cb_" + Math.random().toString(36).slice(2);
        (window as any)[cb] = (j: any) => {
          setData({
            views: Number(j?.totals?.screenPageViews || 0),
            users: Number(j?.totals?.totalUsers || 0),
          });
          delete (window as any)[cb];
          s.remove();
        };
        const s = document.createElement("script");
        s.src = u.toString() + (u.search ? "&" : "?") + "callback=" + cb;
        document.body.appendChild(s);
      });
  }, [api, scope, resolvedPath, start, end]);

  if (!data) return null;

  return (
    <div
      className={[
        "flex items-center gap-2 text-xs text-[var(--muted)]",
        className || "",
      ].join(" ")}
    >
      <span>조회수 {data.views.toLocaleString()}</span>
      <span aria-hidden>·</span>
      <span>사용자 {data.users.toLocaleString()}</span>
    </div>
  );
}
