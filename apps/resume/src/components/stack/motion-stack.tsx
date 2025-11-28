import React from "react";
import { Stack } from "./stack";

import { motion } from "framer-motion";
import { stagger } from "../../constants/motion.config";

interface MotionStackProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function MotionStack({ id, title, children }: MotionStackProps) {
  return (
    <Stack id={id} title={title}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-3"
      >
        {children}
      </motion.div>
    </Stack>
  );
}
