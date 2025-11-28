import { cn } from "@srf/ui";
import { HomeHeader } from "./components/home-header";
import { SectionGrid } from "@/components/section-grid";
import { HOME_SECTIONS } from "./constants/sections";

export default function HomePage() {
  return (
    <div className={cn("min-h-screen bg-white", "px-6 sm:px-8 md:px-12 py-4")}>
      <div className="max-w-7xl mx-auto">
        <HomeHeader />
        <SectionGrid sections={HOME_SECTIONS} />
      </div>
    </div>
  );
}
