import { motion } from "framer-motion";
import { SECTION_ANIMATION } from "../utils/section";

export const ArrowIcon = () => (
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
