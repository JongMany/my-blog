import React from "react";
import { Stack } from "./stack";

import { motion } from "framer-motion";
import { staggerContainer } from "@/constants/motion-variants";

interface MotionStackProps {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}

export function MotionStack({
  id,
  title,
  className,
  children,
}: MotionStackProps) {
  return (
    <Stack id={id} title={title} className={className}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-3"
      >
        {children}
      </motion.div>
    </Stack>
  );
}
