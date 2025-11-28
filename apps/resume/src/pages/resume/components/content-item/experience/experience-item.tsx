import type { Experience } from "@/service";

import { TimelineItem, type TimelineItemData } from "@/pages/resume/components/content-item/shared/timeline-item";

type ExperienceItemProps = {
  item: Experience;
};

/**
 * 경력 아이템 컴포넌트
 */
export default function ExperienceItem({ item }: ExperienceItemProps) {
  // Experience 데이터를 TimelineItemData 형태로 변환
  const timelineData: TimelineItemData = {
    title: item.companyName,
    subtitle: item.position,
    period: item.workPeriod,
    summary: item.overview,
    stacks: item.techStack,
    sections: item.sections,
    bullets: item.bullets,
    keywordImageMap: item.tooltipImages,
  };

  return (
    <TimelineItem
      item={timelineData}
      maxCollapsedItems={3}
      emphasizeTitle={false}
    />
  );
}
