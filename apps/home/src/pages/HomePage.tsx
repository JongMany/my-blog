import { cn } from "@srf/ui";
import { HomeHeader } from "../components/HomeHeader";
import { SectionGrid } from "../components/SectionGrid";
import { sections } from "../consts/sections";

export default function HomePage() {
  return (
    <div className={cn("min-h-screen bg-white", "px-6 sm:px-8 md:px-12 py-2")}>
      <div className="max-w-7xl mx-auto">
        <HomeHeader />
        <SectionGrid sections={sections} />
      </div>
    </div>
  );
}
