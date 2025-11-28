import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, stagger, item } from "@/utils/motion";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 md:p-8">
      {/* 배경 그라데이션 효과 - 미묘하게 */}
      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none absolute -right-20 -top-20 size-[320px] rounded-full bg-[conic-gradient(from_0deg,rgba(59,130,246,.12),transparent_60%)] blur-3xl"
      />
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute -left-16 -bottom-16 size-[240px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,.08),transparent_70%)] blur-3xl"
      />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10">
        <motion.h2
          className="text-xl font-semibold leading-relaxed sm:text-2xl md:text-3xl md:leading-normal"
          {...fadeUp}
        >
          사용자 경험과 개발자 경험을 함께 고민하며, <br />
          기획부터 개발까지 전 과정을 책임감 있게 수행하는 프론트엔드
          개발자입니다.
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-fg)] sm:mt-5 sm:text-base sm:leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px", once: true }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        >
          다양한 레퍼런스를 탐구하고 새로운 시도를 통해 더 나은 서비스 경험을
          만들어갑니다.
        </motion.p>

        {/* 태그 섹션 */}
        <motion.div
          className="mt-6 flex flex-wrap gap-2 sm:mt-7"
          initial="hidden"
          whileInView="show"
          viewport={{ margin: "-10% 0px", once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.06,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {[
            { label: "Frontend", color: "from-blue-500/10 to-cyan-500/10" },
            { label: "UX", color: "from-blue-500/10 to-indigo-500/10" },
            { label: "DX", color: "from-purple-500/10 to-pink-500/10" },
            { label: "협업", color: "from-emerald-500/10 to-teal-500/10" },
          ].map((tag) => (
            <motion.span
              key={tag.label}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3, ease: "easeOut" },
                },
              }}
              className="group relative inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--fg)] transition-all duration-200 hover:border-[var(--primary)]/30 hover:shadow-sm sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="relative z-10">{tag.label}</span>
              <span
                className={`absolute inset-0 rounded-lg bg-gradient-to-r ${tag.color} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
              />
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
