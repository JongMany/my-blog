import { motion } from "framer-motion";
import { cn } from "@srf/ui";
import type { Section } from "@/types/sections";
import { ArrowIcon } from "./arrow-icon";

const GRID_COLUMN_CLASSES: Record<Section["size"], string> = {
  lg: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  md: "sm:col-span-1 lg:col-span-1",
  sm: "sm:col-span-1 lg:col-span-1",
};

function getSectionGridClasses(size: Section["size"]): string {
  return GRID_COLUMN_CLASSES[size];
}

interface SectionCardProps {
  section: Section;
  index: number;
}

export function SectionCard({ section, index }: SectionCardProps) {
  const isLarge = section.size === "lg";
  const hasTags =
    isLarge && section.tags !== undefined && section.tags.length > 0;

  return (
    <motion.a
      key={section.id}
      href={section.href}
      className={cn(
        "group relative overflow-visible rounded-2xl",
        "bg-white shadow-sm hover:shadow-md",
        "transition-all duration-200",
        "min-h-[200px]",
        "sm:min-h-[240px]",
        "no-underline hover:no-underline",
        getSectionGridClasses(section.size),
      )}
      style={{ textDecoration: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.2,
      }}
    >
      {/* 그라데이션 배경 */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          section.color,
          "opacity-0 group-hover:opacity-5 transition-opacity duration-200",
        )}
      />

      {/* 콘텐츠 */}
      <div
        className={cn(
          "relative h-full flex flex-col justify-between",
          "p-6",
          "sm:p-8",
          "md:p-10",
          "lg:p-12",
        )}
      >
        <div>
          <div className="mb-3">
            <div className="flex items-center gap-3 flex-nowrap">
              <span
                className={cn(
                  "text-3xl sm:text-4xl md:text-5xl font-semibold",
                  "text-slate-700",
                  "leading-normal pb-0.5",
                  "whitespace-nowrap",
                )}
                style={{ lineHeight: "1.2" }}
              >
                {section.label}
              </span>
              <ArrowIcon />
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            {section.description}
          </p>
        </div>

        {hasTags && section.tags && <Tags tags={section.tags} />}
      </div>
    </motion.a>
  );
}

interface TagProps {
  tags: string[];
}
const Tags = ({ tags }: TagProps) => (
  <div className="mt-6 sm:mt-8">
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);
