export default function StatsStrip() {
  const stats = [
    { k: "Apps", v: "3" },
    { k: "Runtime", v: "1" },
    { k: "Design", v: "Tailwind" },
    { k: "Routing", v: "React Router" },
  ];
  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white-8 backdrop-blur sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="flex items-center justify-between">
            <span className="text-white-8">{s.k}</span>
            <span className="font-medium">{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
