import { motion } from "framer-motion";
import { cn } from "@srf/ui";

const HEADER_ANIMATION = {
  DURATION: 0.6,
  INITIAL_Y: -20,
  STAGGER_DELAY: 0.1,
} as const;

const INTRO_LINES = [
  "사용자 경험(UX)과 개발자 경험(DX)을 함께 고민하며,",
  "기획부터 개발까지 책임감 있게 수행하는 프론트엔드 개발자입니다.",
  "새로운 기술과 패턴을 빠르게 학습하고 적용하여",
  "더 나은 서비스 경험을 만드는 데 보람을 느낍니다.",
] as const;

export function HomeHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: HEADER_ANIMATION.INITIAL_Y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: HEADER_ANIMATION.DURATION }}
      className="mb-16"
    >
      <h1
        className={cn(
          "text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight",
        )}
      >
        <span
          className={cn(
            "bg-gradient-to-r from-gray-900 to-gray-600",
            "bg-clip-text text-transparent",
          )}
        >
          Hello,
        </span>
        <br />
        <span className="text-gray-800">I'm a Frontend Developer</span>
      </h1>
      <div className={cn("space-y-3 max-w-3xl")}>
        {INTRO_LINES.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay:
                HEADER_ANIMATION.DURATION +
                index * HEADER_ANIMATION.STAGGER_DELAY,
              duration: 0.4,
            }}
            className={cn("text-gray-600 text-base sm:text-lg leading-relaxed")}
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay:
              HEADER_ANIMATION.DURATION +
              INTRO_LINES.length * HEADER_ANIMATION.STAGGER_DELAY,
            duration: 0.4,
          }}
          className={cn(
            "text-gray-500 text-sm sm:text-base mt-4 pt-4 border-t border-gray-200",
          )}
        >
          블로그, 포트폴리오, 이력서를 통해 제 작업과 생각을 공유합니다.
        </motion.p>
      </div>
    </motion.div>
  );
}
