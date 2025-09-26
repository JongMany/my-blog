import React from "react";
import { SectionWithAnimation } from "../../../../../components/layout";
import ActivityItem from "./ActivityItem";
import type { Activity } from "../../../../../service";

interface ActivitySectionProps {
  activities: Activity[];
}

export default function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <SectionWithAnimation id="activities" title="대내외 활동">
      {activities.map((activity) => (
        <ActivityItem
          key={`${activity.title}-${activity.period}`}
          item={activity}
        />
      ))}
    </SectionWithAnimation>
  );
}
