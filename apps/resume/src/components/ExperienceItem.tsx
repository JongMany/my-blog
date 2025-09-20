import React from "react";
import type { Bullet, Experience, PortfolioLink } from "../service/resume";
import { motion } from "framer-motion";
import { vItem } from "./Motion";
import { Card, Button, Meta, PillButton } from "./ui";
import { cn, SimpleCursorTooltip } from "@srf/ui";
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

  const topVisible = item.bullets;
  const collapsed = open ? topVisible : topVisible.slice(0, 3);

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

        {/* 스택 표시 (읽기 전용) */}
        {item.stacks?.length ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {item.stacks.map((s) => (
              <PillButton
                key={s}
                size="sm"
                variant="soft"
                className="px-2.5 py-1 text-[11px]"
              >
                #{s}
              </PillButton>
            ))}
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
