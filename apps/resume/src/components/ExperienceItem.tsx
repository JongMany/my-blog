import React from "react";
import type { Bullet, Experience, PortfolioLink } from "../service/resume";
import { motion } from "framer-motion";
import { vItem } from "./Motion";
import { Card, Button, Meta, PillButton } from "./ui";
import { cn, SimpleCursorTooltip, CursorTooltip } from "@srf/ui";
import { ExternalLink, Github, FileText, Play, Link } from "lucide-react";

/* ───────────── 유틸 ───────────── */
function hash36(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}
function keyFor(path: number[], text: string) {
  return `${path.join(".")}:${hash36(text.trim())}`;
}

type Mode = "OR" | "AND";
const tagsMatch = (sel: Set<string>, tags?: string[], mode: Mode = "OR") => {
  if (sel.size === 0) return true;
  if (!tags?.length) return false;
  return mode === "OR"
    ? tags.some((t) => sel.has(t))
    : [...sel].every((t) => tags.includes(t));
};

/** 매칭 항목(혹은 자식 중 매칭)이 하나라도 있으면 보존하는 필터 */
function filterBullets(
  items: Bullet[],
  pred: (b: Bullet) => boolean,
): Bullet[] {
  const out: Bullet[] = [];
  for (const b of items) {
    const kids = b.children ? filterBullets(b.children, pred) : undefined;
    const keep = pred(b) || (kids && kids.length > 0);
    if (keep) out.push({ ...b, children: kids });
  }
  return out;
}

/** 숫자/약어 강조 */
function Emphasis({ text }: { text: string }) {
  // 1,234 / 3.5% / 120ms / 2x 등도 캡처
  const parts = text.split(
    /(\b\d{1,3}(?:,\d{3})+(?:\.\d+)?%?|\b\d+(?:\.\d+)?(?:ms|s|x|%)?|\b[A-Z]{2,}\b)/g,
  );
  return (
    <>
      {parts.map((p, i) =>
        /\d/.test(p) || /%$|ms$|s$|x$/.test(p) || /^[A-Z]{2,}$/.test(p) ? (
          <strong key={i} className="font-medium text-[var(--fg)]">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** 포트폴리오 링크 아이콘 */
function getLinkIcon(type?: string) {
  switch (type) {
    case "github":
      return <Github className="w-3 h-3" />;
    case "demo":
      return <Play className="w-3 h-3" />;
    case "blog":
      return <FileText className="w-3 h-3" />;
    case "portfolio":
      return <ExternalLink className="w-3 h-3" />;
    default:
      return <Link className="w-3 h-3" />;
  }
}

/** 기술 스택 툴팁 정보 */
const techTooltips: Record<
  string,
  { description: string; category: string; experience?: string }
> = {
  React: {
    description: "사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리",
    category: "Frontend Framework",
    experience: "3년+",
  },
  TypeScript: {
    description: "JavaScript에 정적 타입을 추가한 프로그래밍 언어",
    category: "Programming Language",
    experience: "3년+",
  },
  TradingView: {
    description: "금융 차트 및 트레이딩 플랫폼 개발을 위한 라이브러리",
    category: "Financial Technology",
    experience: "2년+",
  },
  WebSocket: {
    description: "실시간 양방향 통신을 위한 프로토콜",
    category: "Real-time Communication",
    experience: "2년+",
  },
  "Node.js": {
    description: "JavaScript 런타임 환경으로 서버사이드 개발",
    category: "Backend Runtime",
    experience: "2년+",
  },
  PostgreSQL: {
    description: "오픈소스 관계형 데이터베이스 관리 시스템",
    category: "Database",
    experience: "2년+",
  },
  Redis: {
    description: "인메모리 데이터 구조 저장소",
    category: "Cache & Database",
    experience: "1년+",
  },
  Docker: {
    description: "컨테이너 기반 애플리케이션 배포 플랫폼",
    category: "DevOps",
    experience: "1년+",
  },
  AWS: {
    description: "아마존 웹 서비스 클라우드 플랫폼",
    category: "Cloud Platform",
    experience: "1년+",
  },
  GraphQL: {
    description: "API를 위한 쿼리 언어 및 런타임",
    category: "API Technology",
    experience: "1년+",
  },
  Jest: {
    description: "JavaScript 테스팅 프레임워크",
    category: "Testing",
    experience: "2년+",
  },
  Cypress: {
    description: "엔드투엔드 테스팅 프레임워크",
    category: "Testing",
    experience: "1년+",
  },
};

/** 기술 스택 툴팁 컴포넌트 */
function TechTooltip({ tech }: { tech: string }) {
  const tooltipInfo = techTooltips[tech];

  if (!tooltipInfo) {
    return <span className="font-medium">#{tech}</span>;
  }

  return (
    <CursorTooltip
      content={
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-900">{tech}</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {tooltipInfo.description}
          </p>
          <div className="flex gap-1.5">
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md border border-blue-100">
              {tooltipInfo.category}
            </span>
            {tooltipInfo.experience && (
              <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md border border-green-100">
                {tooltipInfo.experience}
              </span>
            )}
          </div>
        </div>
      }
      delay={300}
    >
      <span className="font-medium cursor-help hover:text-[var(--primary)] transition-colors">
        #{tech}
      </span>
    </CursorTooltip>
  );
}

/** 포트폴리오 링크들 */
function PortfolioLinks({ links }: { links: PortfolioLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] text-[var(--fg)] transition-all duration-150 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
        >
          <div className="flex items-center justify-center text-[var(--muted-fg)] transition-colors group-hover:text-[var(--primary)]">
            {getLinkIcon(link.type)}
          </div>
          <span className="font-medium">{link.title}</span>
        </a>
      ))}
    </div>
  );
}

/* ───────────── 컴포넌트 ───────────── */
export default function ExperienceItem({ item }: { item: Experience }) {
  const [open, setOpen] = React.useState(true);
  const [mode, setMode] = React.useState<Mode>("OR");
  const [sel, setSel] = React.useState<string[]>([]);

  const selSet = React.useMemo(() => new Set(sel), [sel]);

  // 선택된 태그가 있으면 중첩까지 필터링, 없으면 원본 유지
  const filtered = React.useMemo(
    () =>
      selSet.size
        ? filterBullets(item.bullets, (b) => tagsMatch(selSet, b.tags, mode))
        : item.bullets,
    [item.bullets, selSet, mode],
  );

  const topVisible = filtered;
  const collapsed = open ? topVisible : topVisible.slice(0, 3);

  const toggle = (s: string) =>
    setSel((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );

  return (
    <motion.article variants={vItem} className="relative pl-4 avoid-break">
      {/* left rail & dot */}
      <span className="pointer-events-none absolute left-0 top-6 bottom-6 w-px bg-[var(--border)]" />
      <span className="absolute left-0 top-5 -translate-x-1/2 size-2 rounded-full bg-[var(--primary)]" />

      <Card className="p-4">
        {/* 헤더 */}
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-[15px] font-medium">{item.company}</h4>
          <span className="text-sm text-[var(--muted-fg)]">{item.role}</span>
          <span className="ml-auto">
            <Meta>{item.period}</Meta>
          </span>
        </div>

        {/* 요약 */}
        {item.summary && (
          <p className="mt-2 text-[13.5px] md:text-sm text-[var(--fg)]">
            {item.summary}
          </p>
        )}

        {/* 스택 필터 바 (토글 + 리셋 + OR/AND) */}
        {item.stacks?.length ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {item.stacks.map((s) => {
              const on = sel.includes(s);
              return (
                <PillButton
                  key={s}
                  size="sm"
                  variant="soft"
                  aria-pressed={on}
                  onClick={() => toggle(s)}
                  className={cn(
                    "px-2.5 py-1 text-[11px]",
                    on &&
                      "border-transparent bg-[var(--primary)] text-[var(--primary-ink)]",
                  )}
                >
                  <TechTooltip tech={s} />
                </PillButton>
              );
            })}
            {sel.length > 0 && (
              <>
                <button
                  onClick={() => setSel([])}
                  className="ml-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-[2px] text-[11px] hover:bg-[var(--hover-bg)]"
                >
                  초기화
                </button>
                <div className="ml-2 inline-flex overflow-hidden rounded-full border border-[var(--border)]">
                  <button
                    onClick={() => setMode("OR")}
                    className={cn(
                      "px-2 py-0.5 text-[11px]",
                      mode === "OR" && "bg-[var(--hover-bg)]",
                    )}
                    aria-pressed={mode === "OR"}
                  >
                    OR
                  </button>
                  <button
                    onClick={() => setMode("AND")}
                    className={cn(
                      "px-2 py-0.5 text-[11px]",
                      mode === "AND" && "bg-[var(--hover-bg)]",
                    )}
                    aria-pressed={mode === "AND"}
                  >
                    AND
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* 최상위 불릿(접기/펼치기 지원) */}
        <div className="mt-3">
          <BulletList items={collapsed} level={0} prefix={[]} />
        </div>

        {topVisible.length > 3 && (
          <div className="mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? "간단히 보기" : `더 보기 (+${topVisible.length - 3})`}
            </Button>
          </div>
        )}
      </Card>
    </motion.article>
  );
}

/** 재귀 렌더링: 레벨별 마커/여백 + 안정 키 */
function BulletList({
  items,
  level,
  prefix,
}: {
  items: Bullet[];
  level: number;
  prefix: number[];
}) {
  const listClass =
    level === 0
      ? "list-disc marker:text-[var(--primary)] pl-5 space-y-1.5"
      : level === 1
        ? "list-[circle] pl-5 space-y-1"
        : "list-[square] pl-5 space-y-1";

  return (
    <ul className={cn(listClass, "text-[13.5px] md:text-sm")}>
      {items.map((b, idx) => {
        const k = keyFor([...prefix, idx], b.text);
        return (
          <li key={k}>
            <div>
              <Emphasis text={b.text} />
              {b.tags?.length ? (
                <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
                  {b.tags.map((t) => (
                    <SimpleCursorTooltip
                      key={`${k}:tag:${t}`}
                      text={`${t} 관련 작업`}
                      delay={200}
                    >
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-[2px] text-[10px] text-[var(--muted-fg)] cursor-help hover:text-[var(--primary)] transition-colors">
                        #{t}
                      </span>
                    </SimpleCursorTooltip>
                  ))}
                </span>
              ) : null}
            </div>
            {b.children?.length ? (
              <div className="mt-1.5">
                <BulletList
                  items={b.children}
                  level={level + 1}
                  prefix={[...prefix, idx]}
                />
              </div>
            ) : null}
            {b.portfolioLinks?.length ? (
              <PortfolioLinks links={b.portfolioLinks} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
