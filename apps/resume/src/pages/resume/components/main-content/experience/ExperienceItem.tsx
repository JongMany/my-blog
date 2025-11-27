import type { Experience } from "../../../../../service";

import { TimelineItem, type TimelineItemData } from "../shared/TimelineItem";

type ExperienceItemProps = {
  item: Experience;
};

/**
 * 경력 아이템 컴포넌트
 */
export default function ExperienceItem({ item }: ExperienceItemProps) {
  // Experience 데이터를 TimelineItemData 형태로 변환
  const timelineData: TimelineItemData = {
    title: item.company,
    subtitle: item.role,
    period: item.period,
    summary: item.summary,
    stacks: item.stacks,
    sections: item.sections,
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
