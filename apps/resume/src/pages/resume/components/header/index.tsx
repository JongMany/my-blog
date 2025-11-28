import { motion } from "framer-motion";
import { cn } from "@srf/ui";
import { imageSource } from "@mfe/shared";

import type { ResumeData } from "@/service";
import { Card } from "@/components/card";
import { useViewport } from "@/contexts/viewport-context";
import {
  fadeUp,
  staggerContainer,
  fadeInItem,
} from "@/constants/motion-variants";

type ProfileHeaderProps = {
  profile: ResumeData["profile"];
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { isDesktop, isTablet, isLargeDesktop } = useViewport();

  return (
    <Card className="relative overflow-hidden p-4 sm:p-6 md:p-8">
      <BackgroundGradient />
      <div
        className={cn(
          "flex gap-4",
          isDesktop ? "flex-row items-start" : "flex-col items-center",
          isTablet && "gap-6",
          isLargeDesktop && "gap-8",
        )}
        style={{ minHeight: "fit-content" }}
      >
        <ProfileImage profile={profile} />
        <ProfileInfo profile={profile} />
      </div>
    </Card>
  );
}

function BackgroundGradient() {
  return (
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
  );
}

function ProfileImage({ profile }: { profile: ResumeData["profile"] }) {
  const { isMobile, isTablet, isLargeDesktop } = useViewport();

  if (!profile.photoUrl) return null;

  return (
    <motion.img
      {...fadeUp}
      src={imageSource(profile.photoUrl, "resume", {
        isDevelopment: import.meta.env.MODE === "development",
      })}
      alt={`${profile.name} 프로필`}
      className={cn(
        "rounded-2xl object-cover border border-[var(--border)] flex-shrink-0",
        isMobile && "size-24",
        isTablet && "size-28",
        isLargeDesktop && "size-32",
        !isMobile && !isTablet && !isLargeDesktop && "size-40",
      )}
    />
  );
}

function ProfileInfo({ profile }: { profile: ResumeData["profile"] }) {
  const { isDesktop } = useViewport();

  return (
    <div className={cn("min-w-0", isDesktop ? "text-left" : "text-center")}>
      <ProfileName name={profile.name} />
      <ProfileTagline tagline={profile.tagline} />
      <IntroList intro={profile.intro} />
    </div>
  );
}

function ProfileName({ name }: { name: string }) {
  const { isDesktop } = useViewport();

  return (
    <motion.h1
      {...fadeUp}
      className={cn(
        "font-semibold tracking-tight",
        isDesktop ? "text-2xl" : "text-xl",
      )}
    >
      {name}
    </motion.h1>
  );
}

function ProfileTagline({ tagline }: { tagline: string }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ delay: 0.04 }}
      className="text-sm text-[var(--muted-fg)]"
    >
      {tagline}
    </motion.div>
  );
}

function IntroList({ intro }: { intro: string[] }) {
  const { isDesktop } = useViewport();

  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={cn(
        "mt-3 space-y-1.5",
        isDesktop ? "text-[12px]" : "text-[11px]",
      )}
    >
      {intro.map((item) => (
        <motion.li variants={fadeInItem} key={item}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
