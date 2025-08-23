import { Link } from "react-router-dom";

export default function FeatureGrid() {
  const items = [
    {
      title: "Blog",
      desc: "개발 노트, 회고, 실험 기록",
      to: "/blog",
      chip: "Remote",
      emoji: "✍️",
      gradient: "from-sky-400/20 to-cyan-400/10",
    },
    {
      title: "Portfolio",
      desc: "프로젝트와 성과를 한눈에",
      to: "/portfolio",
      chip: "Remote",
      emoji: "🧩",
      gradient: "from-violet-400/20 to-fuchsia-400/10",
    },
    {
      title: "Resume",
      desc: "요약 이력서 및 경력 하이라이트",
      to: "/resume",
      chip: "Remote",
      emoji: "📄",
      gradient: "from-emerald-400/20 to-lime-400/10",
    },
  ];
  return (
    <section className="shell:mx-auto shell:mt-10 shell:grid shell:max-w-5xl shell:gap-4 shell:sm:grid-cols-2 shell:lg:grid-cols-3">
      {items.map((it) => (
        <Link key={it.title} to={it.to} className="shell:group">
          <div
            className={[
              "shell:relative shell:overflow-hidden shell:rounded-2xl shell:border shell:border-white/10 shell:bg-white/[0.04] shell:p-5 shell:backdrop-blur shell:transition",
              "shell:hover:border-white/20 shell:hover:bg-white/[0.06] shell:hover:shadow-[0_8px_30px_rgb(0,0,0,0.22)]",
            ].join(" ")}
          >
            {/* 카드 배경 그래디언트 */}
            <div
              className={[
                "shell:pointer-events-none shell:absolute shell:-inset-1 shell:opacity-0 shell:blur-2xl shell:transition shell:group-hover:opacity-100",
                `shell:bg-gradient-to-tr ${it.gradient}`,
              ].join(" ")}
            />
            <div className="shell:relative shell:z-10">
              <div className="shell:mb-3 shell:flex shell:items-center shell:gap-2">
                <span className="shell:text-xl">{it.emoji}</span>
                <h3 className="shell:text-lg shell:font-medium">{it.title}</h3>
                <span className="shell:ml-auto shell:rounded-full shell:border shell:border-white/15 shell:bg-white/5 shell:px-2 shell:py-0.5 shell:text-[10px] shell:text-white-7">
                  {it.chip}
                </span>
              </div>
              <p className="shell:text-sm shell:text-white-7">{it.desc}</p>
              <div className="shell:mt-4 shell:inline-flex shell:items-center shell:gap-1 shell:text-sm shell:text-white-8">
                바로가기
                <span className="shell:transition shell:group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
