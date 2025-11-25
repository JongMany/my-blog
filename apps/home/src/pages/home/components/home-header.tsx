import { motion } from "framer-motion";
import { cn } from "@srf/ui";

const HEADER_ANIMATION = {
  DURATION: 0.6,
  INITIAL_Y: -20,
} as const;

export function HomeHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: HEADER_ANIMATION.INITIAL_Y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: HEADER_ANIMATION.DURATION }}
      className="mb-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
        }}
        className={cn("space-y-4 max-w-3xl")}
      >
        <p className="text-gray-800 text-lg sm:text-xl font-medium">
          안녕하세요! '방구석 코딩쟁이' 이종민입니다.
        </p>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          저는 올해로 2년 차 개발자이고 프론트엔드 엔지니어로 근무하고 있어요.
          제가 만든 제품이 사용자의 편의성을 높이는 데 도움이 되길 바라며
          주도적으로 일하고 있어요.
        </p>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          대학교에서는 데이터분석과 인공지능을 주로 공부했지만, 제가 만든 제품이
          직관적으로 사용자에게 제공되는 프론트엔드의 매력을 느껴 개발자의 길을
          선택했어요.
        </p>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          이 블로그는 제가 경험한 것들을 기록하고 사유하기 위한 공간이에요.
        </p>
      </motion.div>
    </motion.div>
  );
}
