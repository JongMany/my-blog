import { cn } from "@srf/ui";
import { HomeHeader } from "../components/HomeHeader";
import { SectionGrid } from "../components/SectionGrid";
import { sections } from "../consts/sections";

export default function HomePage() {
  return (
    <div className={cn("min-h-screen bg-white", "p-6 sm:p-8 md:p-12")}>
      <div className="max-w-7xl mx-auto">
        <HomeHeader />
        <SectionGrid sections={sections} />
      </div>
    </div>
  );
}
