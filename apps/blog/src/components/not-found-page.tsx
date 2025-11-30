import { imageSource } from "@mfe/shared";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const isDevelopment = import.meta.env.MODE === "development";
  const illustrationSrc = imageSource("/404.svg", "blog", {
    isDevelopment,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <img
        src={illustrationSrc}
        alt="404 Not Found"
        className="max-w-md w-full h-auto"
      />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-sm text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          to="/blog/posts"
          className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          블로그로 돌아가기
        </Link>
      </div>
    </div>
  );
}

