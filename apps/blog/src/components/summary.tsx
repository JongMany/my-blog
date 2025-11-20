import { ReactNode } from "react";

export default function Summary({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-600 m-0">{children}</p>;
}
