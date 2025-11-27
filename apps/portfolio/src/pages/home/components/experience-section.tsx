import Timeline from "./timeline-list";
import { experiences } from "../constants/experiences";

export function ExperienceSection() {
  return <Timeline items={experiences} />;
}
