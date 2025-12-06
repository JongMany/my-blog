import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, easeOutCb } from "@/utils/motion";

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

        {/* CTA 버튼 */}
        <motion.div
          className="mt-6 sm:mt-7"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px", once: true }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <Link
            to="/portfolio/projects"
            className="group inline-flex items-center gap-2 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-5 py-2.5 text-sm font-medium text-[var(--primary)] transition-all duration-200 hover:bg-[var(--primary)]/15 hover:border-[var(--primary)]/50 hover:shadow-sm sm:px-6 sm:py-3 sm:text-base"
          >
            <span>프로젝트 둘러보기</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
