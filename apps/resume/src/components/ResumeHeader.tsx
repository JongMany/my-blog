// apps/resume/src/components/ResumeHeader.tsx

import type { ResumeData } from "../service/resume";
import { motion } from "framer-motion";
import { fadeUp, stagger, vItem } from "./Motion";
import { Card } from "./ui";
import { imageSource } from "@mfe/shared";

export default function ResumeHeader({
  profile,
}: {
  profile: ResumeData["profile"];
}) {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
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
      <div className="flex items-start gap-4">
        {profile.photoUrl && (
          <motion.img
            {...fadeUp}
            src={imageSource(
              profile.photoUrl,
              "resume",
              "http://localhost:3003"
            )}
            alt={`${profile.name} 프로필`}
            className="size-20 rounded-2xl object-cover border border-[var(--border)]"
          />
        )}
        <div className="min-w-0">
          <motion.h1
            {...fadeUp}
            className="text-2xl font-semibold tracking-tight"
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
            className="mt-3 space-y-1.5 text-sm"
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
