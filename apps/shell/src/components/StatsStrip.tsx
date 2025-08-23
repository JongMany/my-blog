export default function StatsStrip() {
  const stats = [
    { k: "Apps", v: "3" },
    { k: "Runtime", v: "1" },
    { k: "Design", v: "Tailwind" },
    { k: "Routing", v: "React Router" },
  ];
  return (
    <section className="shell:mx-auto shell:mt-10 shell:max-w-5xl">
      <div className="shell:grid shell:grid-cols-2 shell:gap-3 shell:rounded-2xl shell:border shell:border-white/10 shell:bg-white/[0.04] p-4 shell:text-sm shell:text-white-8 shell:backdrop-blur shell:sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.k}
            className="shell:flex shell:items-center shell:justify-between"
          >
            <span className="shell:text-white-8">{s.k}</span>
            <span className="shell:font-medium">{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
