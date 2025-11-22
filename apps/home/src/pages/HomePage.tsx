import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "blog",
    label: "Blog",
    description: "생각과 경험을 기록합니다",
    href: "/blog",
    color: "from-blue-500 to-cyan-500",
    size: "large" as const,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "만든 것들을 모았습니다",
    href: "/portfolio",
    color: "from-purple-500 to-pink-500",
    size: "medium" as const,
  },
  {
    id: "resume",
    label: "Resume",
    description: "경력과 스킬을 정리했습니다",
    href: "/resume",
    color: "from-orange-500 to-red-500",
    size: "small" as const,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Hello,
            </span>
            <br />
            <span className="text-gray-800">I'm a Developer</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            블로그, 포트폴리오, 이력서를 통해 제 작업과 생각을 공유합니다.
          </p>
        </motion.div>

        {/* 비대칭 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
          {sections.map((section, index) => {
            const isLarge = section.size === "large";
            const isMedium = section.size === "medium";
            const isSmall = section.size === "small";

            return (
              <motion.a
                key={section.id}
                href={section.href}
                className={`
                  group relative overflow-hidden rounded-2xl
                  ${isLarge ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
                  ${isMedium ? "sm:col-span-1 lg:col-span-1" : ""}
                  ${isSmall ? "sm:col-span-1 lg:col-span-1" : ""}
                  bg-white shadow-lg hover:shadow-2xl
                  transition-all duration-100
                  min-h-[200px] sm:min-h-[240px]
                  no-underline hover:no-underline
                `}
                style={{ textDecoration: "none" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.1 },
                }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {/* 그라데이션 배경 */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${section.color}
                    opacity-0 group-hover:opacity-10 transition-opacity duration-100
                  `}
                />

                {/* 콘텐츠 */}
                <div
                  className={`
                    relative p-6 sm:p-8 md:p-10 lg:p-12 h-full
                    flex flex-col justify-between
                  `}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3 flex-wrap overflow-visible">
                      <span
                        className={`
                          text-3xl sm:text-4xl md:text-5xl font-bold
                          bg-gradient-to-r ${section.color} bg-clip-text text-transparent
                          leading-normal pb-0.5 block
                        `}
                        style={{ lineHeight: "1.2" }}
                      >
                        {section.label}
                      </span>
                      <motion.svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.1 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </motion.svg>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {section.description}
                    </p>
                  </div>

                  {isLarge && (
                    <div className="mt-6 sm:mt-8">
                      <div className="flex gap-2 flex-wrap">
                        {["개발", "디자인", "기획"].map((tag, i) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 호버 시 장식 요소 */}
                <div
                  className={`
                    absolute bottom-0 right-0 w-32 h-32
                    bg-gradient-to-tl ${section.color}
                    opacity-0 group-hover:opacity-5
                    blur-3xl transition-opacity duration-100
                  `}
                />
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
