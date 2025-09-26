import React, { useState } from "react";
import type { Bullet, PortfolioLink } from "../../../../../service";
import { motion } from "framer-motion";
import {
  BulletList,
  Button,
  Card,
  Emphasis,
  Meta,
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
  bullets: Bullet[];
  portfolioLinks?: PortfolioLink[];
  keywordImageMap?: Record<string, string>;
}

interface TimelineItemProps {
  item: TimelineItemData;
  maxCollapsedItems?: number;
  emphasizeTitle?: boolean;
}

export function TimelineItem({
  item,
  maxCollapsedItems = 3,
  emphasizeTitle = false,
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const visibleBullets = isExpanded
    ? item.bullets
    : item.bullets.slice(0, maxCollapsedItems);

  const hasMoreItems = item.bullets.length > maxCollapsedItems;

  return (
    <motion.article variants={vItem} className="relative pl-4 avoid-break">
      <TimelineRail />
      <Card className="p-4">
        <TimelineHeader item={item} emphasizeTitle={emphasizeTitle} />
        <TimelineSummary summary={item.summary} />
        <TimelineStacks stacks={item.stacks} />
        <TimelinePortfolioLinks links={item.portfolioLinks} />
        <TimelineBullets
          bullets={visibleBullets}
          keywordImageMap={item.keywordImageMap}
        />
        <TimelineToggle
          isExpanded={isExpanded}
          hasMoreItems={hasMoreItems}
          remainingCount={item.bullets.length - maxCollapsedItems}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
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
          <Meta>{item.period}</Meta>
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
