import Timeline from "./Timeline";
import { experiences } from "../constants/experiences";

export function Experience() {
  return <Timeline items={experiences} />;
}
