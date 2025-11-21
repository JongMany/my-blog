import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import CategoryNavigation from "./category-navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="px-2.5">
      {/* 카테고리 네비게이션 */}
      <CategoryNavigation />

      {/* 메인 콘텐츠 영역 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
