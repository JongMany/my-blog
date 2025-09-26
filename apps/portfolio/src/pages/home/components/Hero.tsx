import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, stagger, item } from "../../../components/motion/Motion";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute -right-20 -top-24 size-[360px] rounded-full bg-[conic-gradient(from_0deg,rgba(27,100,255,.25),transparent_60%)] blur-3xl"
      />
      <motion.h1
        className="text-balance text-3xl font-semibold sm:text-4xl"
        {...fadeUp}
      >
        사용자 경험(UX)과 개발자 경험(DX)을 함께 고민하며, 기획부터 개발까지
        책임감 있게 수행하는 프론트엔드 개발자입니다.
      </motion.h1>
      <motion.p
        className="mt-3 max-w-2xl text-[var(--muted-fg)]"
        {...fadeUp}
        transition={{ delay: 0.05 }}
      >
        다양한 레퍼런스를 탐구하고 새로운 시도를 통해, 더 나은 서비스 경험을
        만들어가는 데 집중합니다.
      </motion.p>
      <motion.div
        className="mt-6 flex flex-wrap gap-2"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {["UX", "DX", "소통", "기획"].map((s) => (
          <motion.span key={s} variants={item} className="t-chip">
            {s}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
