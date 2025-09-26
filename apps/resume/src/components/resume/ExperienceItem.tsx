import React from "react";
import type { Experience } from "../../service";
import { TimelineItem, type TimelineItemData } from "./TimelineItem";

/**
 * 경력 아이템 컴포넌트
 *
 * @description
 * - TimelineItem을 사용하여 경력 데이터를 렌더링
 * - 최대 3개 아이템까지 접기/펼치기 지원
 */
export default function ExperienceItem({ item }: { item: Experience }) {
  // Experience 데이터를 TimelineItemData 형태로 변환
  const timelineData: TimelineItemData = {
    title: item.company,
    subtitle: item.role,
    period: item.period,
    summary: item.summary,
    stacks: item.stacks,
    bullets: item.bullets,
    keywordImageMap: item.keywordImageMap,
  };

  return (
    <TimelineItem
      item={timelineData}
      maxCollapsedItems={3}
      emphasizeTitle={false}
    />
  );
}
