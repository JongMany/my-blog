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
    <section className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <Link key={it.title} to={it.to} className="group">
          <div
            className={[
              "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition",
              "hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgb(0,0,0,0.22)]",
            ].join(" ")}
          >
            {/* 카드 배경 그래디언트 */}
            <div
              className={[
                "pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition group-hover:opacity-100",
                `bg-gradient-to-tr ${it.gradient}`,
              ].join(" ")}
            />
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{it.emoji}</span>
                <h3 className="text-lg font-medium">{it.title}</h3>
                <span className="ml-auto rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-white-7">
                  {it.chip}
                </span>
              </div>
              <p className="text-sm text-white-7">{it.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-white-8">
                바로가기
                <span className="transition group-hover:translate-x-0.5">
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
