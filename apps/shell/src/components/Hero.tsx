import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white-7 backdrop-blur">
        <span className="size-2 rounded-full bg-emerald-400/80 " />
        Micro-frontend Shell · React + Vite + Tailwind
      </div>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          블로그 · 포트폴리오 · 이력서
        </span>{" "}
        를 <span className="whitespace-nowrap">하나의 경험</span>으로
      </h2>

      <p className="mt-4 max-w-2xl text-balance text-white-7">
        모듈 페더레이션으로 분리된 앱을 유연하게 연결합니다. 전역
        상태·라우팅·쿼리를 호스트에서 일원화하고, 각 리모트는 독립적으로
        배포하세요.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/portfolio"
          className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium shadow/30 shadow-black/30 transition hover:translate-y-[-1px] hover:shadow-lg"
        >
          포트폴리오 보기
        </Link>
        <Link
          to="/blog"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white-9 backdrop-blur transition hover:bg-white/10"
        >
          블로그로 이동
        </Link>
        <Link
          to="/resume"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white-9 backdrop-blur transition hover:bg-white/10"
        >
          이력서 보기
        </Link>
      </div>
    </section>
  );
}
