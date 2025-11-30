import { imageSource } from "@mfe/shared";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const isDevelopment = import.meta.env.MODE === "development";
  const illustrationSrc = imageSource("/404.svg", "home", {
    isDevelopment,
  });

  return (
    <div className="shell:flex shell:flex-col shell:items-center shell:justify-center shell:min-h-[60vh] shell:gap-6 shell:px-4">
      <img
        src={illustrationSrc}
        alt="404 Not Found"
        className="shell:max-w-md shell:w-full shell:h-auto"
      />
      <div className="shell:text-center shell:space-y-4">
        <h1 className="shell:text-2xl shell:font-semibold shell:text-[var(--fg)]">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="shell:text-sm shell:text-[var(--muted-fg)]">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          to="/"
          className="shell:inline-block shell:mt-4 shell:px-4 shell:py-2 shell:rounded-full shell:bg-[var(--primary)] shell:text-white shell:text-sm shell:font-medium shell:hover:opacity-90 shell:transition-opacity"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

