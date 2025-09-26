// apps/resume/src/components/ResumeHeader.tsx
import React from "react";
import type { ResumeData } from "../../../service";
import { motion } from "framer-motion";
import { fadeUp, stagger, vItem } from "../../../constants";
import { Card } from "../../../components/card";
import { imageSource } from "@mfe/shared";

export default function ProfileHeader({
  profile,
}: {
  profile: ResumeData["profile"];
}) {
  return (
    <Card className="relative overflow-hidden p-4 sm:p-6 md:p-8">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(600px 240px at 80% -20%, rgba(27,100,255,.18), transparent 60%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.3), transparent)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.3), transparent)",
        }}
      />
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
        {profile.photoUrl && (
          <motion.img
            {...fadeUp}
            src={imageSource(
              profile.photoUrl,
              "resume",
              "http://localhost:3003",
            )}
            alt={`${profile.name} 프로필`}
            className="size-24 sm:size-32 md:size-40 rounded-2xl object-cover border border-[var(--border)] flex-shrink-0"
          />
        )}
        <div className="min-w-0 text-left">
          <motion.h1
            {...fadeUp}
            className="text-xl sm:text-2xl font-semibold tracking-tight"
          >
            {profile.name}
          </motion.h1>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.04 }}
            className="text-sm text-[var(--muted-fg)]"
          >
            {profile.tagline}
          </motion.div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-3 space-y-1.5 text-[11px] sm:text-[12px]"
          >
            {profile.intro.map((t, i) => (
              <motion.li variants={vItem} key={i}>
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </Card>
  );
}
