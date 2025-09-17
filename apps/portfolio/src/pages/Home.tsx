// apps/portfolio/src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../components/Layout";
import { SEO } from "../components/SEO";
import { usePortfolioIndex, experiences, skills } from "../service/portfolio";
import ProjectCard from "../components/ProjectCard";
import { fadeUp, stagger, item } from "../components/Motion";
import Timeline from "../components/Timeline";

export default function Home() {
  const { data: portfolioIndex, isLoading } = usePortfolioIndex();
  const top = portfolioIndex?.all.slice(0, 6) ?? [];
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-[var(--muted-fg)]">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Frontend Developer 프로젝트 모음"
        description="TradingView 차트 주문 시스템, AI 캐릭터 텍스트 파싱, WebSocket Fallback 시스템 등 다양한 프론트엔드 프로젝트를 확인하세요."
        keywords="포트폴리오, 프론트엔드 개발자, React, TypeScript, TradingView, AI, WebSocket, 프로젝트"
      />
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
