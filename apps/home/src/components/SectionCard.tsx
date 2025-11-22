import { motion } from "framer-motion";
import { cn } from "@srf/ui";
import type { Section } from "../consts/sections";
import {
  getSectionGridClasses,
  SECTION_ANIMATION,
  SECTION_STYLES,
} from "../utils/section";

interface SectionCardProps {
  section: Section;
  index: number;
}

const ArrowIcon = () => (
  <motion.svg
    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    initial={{ x: 0 }}
    whileHover={{ x: 5 }}
    transition={{ duration: SECTION_ANIMATION.HOVER_DURATION }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </motion.svg>
);

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

export function SectionCard({ section, index }: SectionCardProps) {
  const isLarge = section.size === "lg";
  const hasTags =
    isLarge && section.tags !== undefined && section.tags.length > 0;

  return (
    <motion.a
      key={section.id}
      href={section.href}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white shadow-lg hover:shadow-2xl",
        "transition-all duration-100",
        SECTION_STYLES.MIN_HEIGHT.base,
        SECTION_STYLES.MIN_HEIGHT.sm,
        "no-underline hover:no-underline",
        getSectionGridClasses(section.size),
      )}
      style={{ textDecoration: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{
        scale: SECTION_ANIMATION.HOVER_SCALE,
        transition: {
          duration: SECTION_ANIMATION.HOVER_DURATION,
          ease: SECTION_ANIMATION.EASE,
        },
      }}
      transition={{
        delay: index * SECTION_ANIMATION.STAGGER_DELAY,
        duration: SECTION_ANIMATION.DURATION,
        scale: {
          duration: SECTION_ANIMATION.SCALE_DURATION,
          ease: SECTION_ANIMATION.EASE,
        },
      }}
    >
      {/* 그라데이션 배경 */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          section.color,
          "opacity-0 group-hover:opacity-10 transition-opacity duration-100",
        )}
      />

      {/* 콘텐츠 */}
      <div
        className={cn(
          "relative h-full flex flex-col justify-between",
          SECTION_STYLES.PADDING.base,
          SECTION_STYLES.PADDING.sm,
          SECTION_STYLES.PADDING.md,
          SECTION_STYLES.PADDING.lg,
        )}
      >
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap overflow-visible">
            <span
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl font-bold",
                "bg-gradient-to-r bg-clip-text text-transparent",
                "leading-normal pb-0.5 block",
                section.color,
              )}
              style={{ lineHeight: "1.2" }}
            >
              {section.label}
            </span>
            <ArrowIcon />
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            {section.description}
          </p>
        </div>

        {hasTags && section.tags && <Tags tags={section.tags} />}
      </div>

      {/* 호버 시 장식 요소 */}
      <div
        className={cn(
          "absolute bottom-0 right-0 w-32 h-32",
          "bg-gradient-to-tl blur-3xl",
          "opacity-0 group-hover:opacity-5",
          "transition-opacity duration-100",
          section.color,
        )}
      />
    </motion.a>
  );
}
