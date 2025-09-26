import React from "react";
import type { SideProject } from "../../service";
import { TimelineItem, type TimelineItemData } from "./TimelineItem";

/**
 * 사이드 프로젝트 아이템 컴포넌트
 *
 * @description
 * - TimelineItem을 사용하여 사이드 프로젝트 데이터를 렌더링
 * - 최대 2개 아이템까지 접기/펼치기 지원
 * - 제목에 Emphasis 적용
 */
export default function SideProjectItem({ item }: { item: SideProject }) {
  // SideProject 데이터를 TimelineItemData 형태로 변환
  const timelineData: TimelineItemData = {
    title: item.title,
    period: item.period,
    summary: item.summary,
    stacks: item.stacks,
    bullets: item.bullets,
    portfolioLinks: item.portfolioLinks,
    keywordImageMap: item.keywordImageMap,
  };

  return (
    <TimelineItem
      item={timelineData}
      maxCollapsedItems={2}
      emphasizeTitle={true}
    />
  );
}
