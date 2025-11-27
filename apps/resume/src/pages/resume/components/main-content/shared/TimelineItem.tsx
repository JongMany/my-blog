import React, { useState } from "react";
import type { Bullet, PortfolioLink, Section } from "../../../../../service";
import { motion } from "framer-motion";
import {
  BulletList,
  Button,
  Card,
  Emphasis,
  MetaBadge,
  PillButton,
  PortfolioLinks,
} from "../../../../../components";
import { vItem } from "../../../../../constants";

export interface TimelineItemData {
  title: string;
  subtitle?: string;
  period?: string;
  summary?: string;
  stacks?: string[];
  sections?: Section[];
  bullets?: Bullet[];
  portfolioLinks?: PortfolioLink[];
  keywordImageMap?: Record<string, string>;
}

interface TimelineItemProps {
  item: TimelineItemData;
  maxCollapsedItems?: number;
  emphasizeTitle?: boolean;
}

// Section 컴포넌트
function SectionItem({
  section,
  keywordImageMap,
}: {
  section: Section;
  keywordImageMap?: Record<string, string>;
}) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-[var(--primary)] mb-2">
        {section.title}
      </h4>
      {section.description && (
        <div className="text-[11px] text-[var(--muted-fg)] leading-relaxed mb-3 whitespace-pre-line">
          <Emphasis
            text={section.description}
            keywordImageMap={keywordImageMap}
          />
        </div>
      )}
      <BulletList
        items={section.bullets}
        level={0}
        prefix={[]}
        keywordImageMap={keywordImageMap}
        Emphasis={Emphasis}
        PortfolioLinks={PortfolioLinks}
      />
      {section.portfolioLinks?.length && (
        <PortfolioLinks links={section.portfolioLinks} />
      )}
    </div>
  );
}

export function TimelineItem({
  item,
  maxCollapsedItems = 3,
  emphasizeTitle = false,
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // sections가 있으면 sections를 사용, 없으면 기존 bullets 사용
  const hasSections = item.sections && item.sections.length > 0;
  const bullets = item.bullets || [];

  const visibleBullets = isExpanded
    ? bullets
    : bullets.slice(0, maxCollapsedItems);

  const hasMoreItems = bullets.length > maxCollapsedItems;

  return (
    <motion.article variants={vItem} className="relative pl-4 avoid-break">
      <TimelineRail />
      <Card className="p-4">
        <TimelineHeader item={item} emphasizeTitle={emphasizeTitle} />
        <TimelineSummary summary={item.summary} />
        <TimelineStacks stacks={item.stacks} />
        <TimelinePortfolioLinks links={item.portfolioLinks} />

        {/* sections가 있으면 sections 렌더링, 없으면 기존 bullets 렌더링 */}
        {hasSections ? (
          <div className="mt-3">
            {item.sections?.map((section, index) => (
              <SectionItem
                key={index}
                section={section}
                keywordImageMap={item.keywordImageMap}
              />
            ))}
          </div>
        ) : (
          <>
            <TimelineBullets
              bullets={visibleBullets}
              keywordImageMap={item.keywordImageMap}
            />
            <TimelineToggle
              isExpanded={isExpanded}
              hasMoreItems={hasMoreItems}
              remainingCount={bullets.length - maxCollapsedItems}
              onToggle={() => setIsExpanded(!isExpanded)}
            />
          </>
        )}
      </Card>
    </motion.article>
  );
}

function TimelineRail() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-6 bottom-6 w-px bg-[var(--border)]" />
      <span className="absolute left-0 top-5 -translate-x-1/2 size-2 rounded-full bg-[var(--primary)]" />
    </>
  );
}

interface TimelineHeaderProps {
  item: TimelineItemData;
  emphasizeTitle: boolean;
}

function TimelineHeader({ item, emphasizeTitle }: TimelineHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <h4 className="text-[15px] font-medium">
        {emphasizeTitle ? (
          <Emphasis text={item.title} keywordImageMap={item.keywordImageMap} />
        ) : (
          item.title
        )}
      </h4>
      {item.subtitle && (
        <span className="text-sm text-[var(--muted-fg)]">{item.subtitle}</span>
      )}
      {item.period && (
        <span className="ml-auto">
          <MetaBadge>{item.period}</MetaBadge>
        </span>
      )}
    </div>
  );
}

function TimelineSummary({ summary }: { summary?: string }) {
  if (!summary) return null;

  return <p className="mt-2 text-[12.5px] text-[var(--fg)]">{summary}</p>;
}

function TimelineStacks({ stacks }: { stacks?: string[] }) {
  if (!stacks?.length) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {stacks.map((stack) => (
        <PillButton
          key={stack}
          size="sm"
          variant="soft"
          className="px-2.5 py-1 text-[11px]"
        >
          #{stack}
        </PillButton>
      ))}
    </div>
  );
}

function TimelinePortfolioLinks({ links }: { links?: PortfolioLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-2">
      <PortfolioLinks links={links} />
    </div>
  );
}

function TimelineBullets({
  bullets,
  keywordImageMap,
}: {
  bullets: Bullet[];
  keywordImageMap?: Record<string, string>;
}) {
  return (
    <div className="mt-3">
      <BulletList
        items={bullets}
        level={0}
        prefix={[]}
        keywordImageMap={keywordImageMap}
        Emphasis={Emphasis}
        PortfolioLinks={PortfolioLinks}
      />
    </div>
  );
}

interface TimelineToggleProps {
  isExpanded: boolean;
  hasMoreItems: boolean;
  remainingCount: number;
  onToggle: () => void;
}

function TimelineToggle({
  isExpanded,
  hasMoreItems,
  remainingCount,
  onToggle,
}: TimelineToggleProps) {
  if (!hasMoreItems) return null;

  return (
    <div className="mt-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {isExpanded ? "간단히 보기" : `더 보기 (+${remainingCount})`}
      </Button>
    </div>
  );
}
