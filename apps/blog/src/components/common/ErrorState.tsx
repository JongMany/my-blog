import { Link } from "react-router-dom";

// Props 타입 정의
interface ErrorStateProps {
  error: Error;
  backTo?: string;
  backText?: string;
}

export function ErrorState({
  error,
  backTo = "/blog",
  backText = "목록으로 돌아가기",
}: ErrorStateProps) {
  return (
    <div className="text-center">
      <p className="text-red-300">에러: {error.message}</p>
      <Link
        to={backTo}
        className="mt-4 inline-block text-blue-400 hover:underline"
      >
        ← {backText}
      </Link>
    </div>
  );
}
