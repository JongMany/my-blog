import React from "react";

import type { Activity } from "../../../../../service";
import { MotionStack } from "../../../../../components/stack";
import ActivityItem from "./ActivityItem";

interface ActivitySectionProps {
  activities: Activity[];
}

export default function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <MotionStack id="activities" title="대내외 활동">
      {activities.map((activity) => (
        <ActivityItem
          key={`${activity.title}-${activity.period}`}
          item={activity}
        />
      ))}
    </MotionStack>
  );
}
