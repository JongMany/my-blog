import Timeline from "./timeline-list";
import { experiences } from "@/pages/home/constants/experiences";

export function ExperienceSection() {
  return <Timeline items={experiences} />;
}
