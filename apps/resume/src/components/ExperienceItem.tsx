import React from "react";
import type { Bullet, Experience, PortfolioLink } from "../service/resume";
import { motion } from "framer-motion";
import { vItem } from "./Motion";
import { Card, Button, Meta, PillButton } from "./ui";
import { cn, SimpleCursorTooltip } from "@srf/ui";
import { Emphasis, BulletList, PortfolioLinks } from "./common";

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
          <p className="mt-2 text-[12.5px] text-[var(--fg)]">{item.summary}</p>
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
          <BulletList
            items={collapsed}
            level={0}
            prefix={[]}
            keywordImageMap={item.keywordImageMap}
          />
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
