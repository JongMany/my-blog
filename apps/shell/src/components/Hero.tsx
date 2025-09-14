import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="shell:relative shell:mx-auto shell:max-w-5xl">
      <div className="shell:inline-flex shell:items-center shell:gap-2 shell:rounded-full shell:border shell:border-white/15 shell:bg-white/5 shell:px-3 shell:py-1 shell:text-xs shell:text-white-7 shell:backdrop-blur">
        <span className="shell:size-2 shell:rounded-full shell:bg-amber-400/80" />
        항상 성장하는 개발자 · Frontend Engineer
      </div>

      <h2 className="shell:mt-4 shell:text-4xl shell:font-semibold shell:tracking-tight sm:shell:text-5xl">
        <span className="shell:bg-gradient-to-r shell:from-sky-400 shell:via-violet-400 shell:to-fuchsia-400 shell:bg-clip-text shell:text-transparent">
          부족한 것을 매꾸려고 하는
        </span>{" "}
        <span className="shell:whitespace-nowrap">사람입니다</span>
      </h2>

      <p className="shell:mt-4 shell:max-w-2xl shell:text-balance shell:text-white-7">
        완벽하지 않다는 것을 인정하고, 모르는 것이 있으면 배우려 합니다. 작은
        개선이라도 꾸준히 쌓아가며, 더 나은 코드와 경험을 만들어가고 싶어요.
      </p>
    </section>
  );
}
