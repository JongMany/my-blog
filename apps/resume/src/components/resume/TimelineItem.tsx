import React from "react";
import { motion } from "framer-motion";
import { vItem } from "../../constants";
import { Card } from "../card";
import { Button, PillButton } from "../button";
import { Meta } from "../badge";
import { BulletList } from "../bullet-list";
import { Emphasis } from "../emphasis";
import { PortfolioLinks } from "../portfolio-link";
import type { Bullet, PortfolioLink } from "../../service";

/**
 * 타임라인 아이템의 공통 구조를 정의하는 인터페이스
 */
export interface TimelineItemData {
  /** 제목 (회사명 또는 프로젝트명) */
  title: string;
  /** 부제목 (역할 또는 기간) */
  subtitle?: string;
  /** 기간 */
  period?: string;
  /** 요약 설명 */
  summary?: string;
  /** 기술 스택 */
  stacks?: string[];
  /** 불릿 포인트들 */
  bullets: Bullet[];
  /** 포트폴리오 링크들 */
  portfolioLinks?: PortfolioLink[];
  /** 키워드 이미지 매핑 */
  keywordImageMap?: Record<string, string>;
}

interface TimelineItemProps {
  /** 타임라인 아이템 데이터 */
  item: TimelineItemData;
  /** 접기/펼치기 시 보여줄 최대 아이템 수 */
  maxCollapsedItems?: number;
  /** 제목에 Emphasis 적용 여부 */
  emphasizeTitle?: boolean;
}

/**
 * 공통 타임라인 아이템 컴포넌트
 *
 * @description
 * - ExperienceItem과 SideProjectItem의 공통 패턴을 추출
 * - 접기/펼치기 기능 지원
 * - 포트폴리오 링크, 스택, 불릿 리스트 등을 포함
 *
 * @example
 * ```tsx
 * <TimelineItem
 *   item={experienceData}
 *   maxCollapsedItems={3}
 *   emphasizeTitle={false}
 * />
 * ```
 */
export function TimelineItem({
  item,
  maxCollapsedItems = 3,
  emphasizeTitle = false,
}: TimelineItemProps) {
  const [open, setOpen] = React.useState(true);

  const topVisible = item.bullets;
  const collapsed = open ? topVisible : topVisible.slice(0, maxCollapsedItems);

  return (
    <motion.article variants={vItem} className="relative pl-4 avoid-break">
      {/* left rail & dot */}
      <span className="pointer-events-none absolute left-0 top-6 bottom-6 w-px bg-[var(--border)]" />
      <span className="absolute left-0 top-5 -translate-x-1/2 size-2 rounded-full bg-[var(--primary)]" />

      <Card className="p-4">
        {/* 헤더 */}
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-[15px] font-medium">
            {emphasizeTitle ? (
              <Emphasis
                text={item.title}
                keywordImageMap={item.keywordImageMap}
              />
            ) : (
              item.title
            )}
          </h4>
          {item.subtitle && (
            <span className="text-sm text-[var(--muted-fg)]">
              {item.subtitle}
            </span>
          )}
          {item.period && (
            <span className="ml-auto">
              <Meta>{item.period}</Meta>
            </span>
          )}
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

        {/* 포트폴리오 링크 */}
        {item.portfolioLinks?.length ? (
          <div className="mt-2">
            <PortfolioLinks links={item.portfolioLinks} />
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

        {topVisible.length > maxCollapsedItems && (
          <div className="mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open
                ? "간단히 보기"
                : `더 보기 (+${topVisible.length - maxCollapsedItems})`}
            </Button>
          </div>
        )}
      </Card>
    </motion.article>
  );
}
