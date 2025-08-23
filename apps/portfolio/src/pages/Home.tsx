// apps/portfolio/src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../components/Layout";
import { projects, experiences, skills } from "../service/portfolio";
import ProjectCard from "../components/ProjectCard";
import { fadeUp, stagger, item } from "../components/Motion";
import Timeline from "../components/Timeline";

export default function Home() {
  const top = projects.slice(0, 6);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <motion.div
            style={{ y }}
            className="pointer-events-none absolute -right-20 -top-24 size-[360px] rounded-full bg-[conic-gradient(from_0deg,rgba(27,100,255,.25),transparent_60%)] blur-3xl"
          />
          <motion.h1
            className="text-balance text-3xl font-semibold sm:text-4xl"
            {...fadeUp}
          >
            속도와 감성을 함께 담는 인터랙션을 만듭니다.
          </motion.h1>
          <motion.p
            className="mt-3 max-w-2xl text-[var(--muted-fg)]"
            {...fadeUp}
            transition={{ delay: 0.05 }}
          >
            Vite + Module Federation 기반 MFE, 성능/접근성 중심의 프런트엔드.
          </motion.p>
          <motion.div
            className="mt-6 flex flex-wrap gap-2"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              "React",
              "Vite",
              "Module Federation",
              "Tailwind",
              "Framer Motion",
            ].map((s) => (
              <motion.span key={s} variants={item} className="t-chip">
                {s}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Selected Projects */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Selected Projects</h3>
            <Link to="/portfolio/projects" className="t-btn text-sm">
              전체 보기 →
            </Link>
          </div>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {top.map((p) => (
              <motion.div key={p.slug} variants={item}>
                <ProjectCard p={p} />
              </motion.div>
            ))}
          </motion.ul>
        </section>

        {/* Experience */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Experience</h3>

          <Timeline items={experiences} />
        </section>

        {/* Skills */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="grid gap-3 sm:grid-cols-4">
            {skills.map((s) => (
              <motion.div key={s.name} {...fadeUp} className="t-card p-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="text-[var(--muted-fg)]">{s.lvl}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--hover-bg)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.lvl}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-[var(--primary)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
