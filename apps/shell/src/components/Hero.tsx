import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="shell:relative shell:mx-auto shell:max-w-5xl">
      <div className="shell:inline-flex shell:items-center shell:gap-2 shell:rounded-full shell:border shell:border-white/15 shell:bg-white/5 shell:px-3 shell:py-1 shell:text-xs shell:text-white-7 shell:backdrop-blur">
        <span className="shell:size-2 shell:rounded-full shell:bg-emerald-400/80" />
        Micro-frontend Shell · React + Vite + Tailwind
      </div>

      <h2 className="shell:mt-4 shell:text-4xl shell:font-semibold shell:tracking-tight sm:shell:text-5xl">
        <span className="shell:bg-gradient-to-r shell:from-sky-400 shell:via-violet-400 shell:to-fuchsia-400 shell:bg-clip-text shell:text-transparent">
          블로그 · 포트폴리오 · 이력서
        </span>{" "}
        를 <span className="shell:whitespace-nowrap">하나의 경험</span>으로
      </h2>

      <p className="shell:mt-4 shell:max-w-2xl shell:text-balance shell:text-white-7">
        모듈 페더레이션으로 분리된 앱을 유연하게 연결합니다. 전역
        상태·라우팅·쿼리를 호스트에서 일원화하고, 각 리모트는 독립적으로
        배포하세요.
      </p>
    </section>
  );
}
// function AppChip({
//   to,
//   label,
//   emoji,
// }: {
//   to: string;
//   label: string;
//   emoji: string;
// }) {
//   return (
//     <li>
//       <Link
//         to={to}
//         className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/85 backdrop-blur transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
//         aria-label={`${label}로 이동`}
//       >
//         <span className="text-base leading-none">{emoji}</span>
//         <span className="text-sm font-medium">{label}</span>
//         <span
//           aria-hidden
//           className="ml-0.5 translate-x-0 text-white/70 transition group-hover:translate-x-0.5"
//         >
//           →
//         </span>
//       </Link>
//     </li>
//   );
// }

// function Connector() {
//   return (
//     <li
//       aria-hidden
//       className="hidden h-px w-6 flex-1 min-w-6 shrink sm:block sm:max-w-[64px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
//     />
//   );
// }
