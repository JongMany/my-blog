import React from "react";
import { motion } from "framer-motion";
import { stagger } from "../../../constants";
import { Section } from "../../../components/layout";

interface SectionWithAnimationProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function SectionWithAnimation({
  id,
  title,
  children,
}: SectionWithAnimationProps) {
  return (
    <Section id={id} title={title}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-3"
      >
        {children}
      </motion.div>
    </Section>
  );
}
