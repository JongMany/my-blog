import { Activity } from "lucide-react";
import { calculateMyAge } from "@/utils/calculate-my-age";
import type { ReactNode } from "react";

// Blog 특화 컴포넌트들
export function MyThought({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      {children}
    </div>
  );
}

export function Short() {
  return (
    <div className="flex w-full items-center gap-1 border-b border-gray-200 pb-2">
      <span className="text-xl font-semibold">숏</span>
      <Activity size={20} color="#98a3cd" />
    </div>
  );
}

export function Long() {
  return (
    <div className="flex w-full items-center gap-1 border-b border-gray-200 pb-2">
      <span className="text-xl font-semibold">롱</span>
      <Activity size={20} color="#ed1d65" className="scale-x-[-1] transform" />
    </div>
  );
}

export function Year() {
  return <span>{new Date().getFullYear()}</span>;
}

export function Month() {
  return <span>{new Date().getMonth() + 1}</span>;
}

export function Age() {
  return <span>{calculateMyAge()}</span>;
}

export function BooksLeftToRead() {
  const age = calculateMyAge();
  const booksLeftToRead = (70 - age) * 18;
  return <span>{booksLeftToRead}</span>;
}

export function Resource({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full justify-end">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500"
        >
          {children}
        </a>
      ) : (
        <p className="text-xs text-gray-500">{children}</p>
      )}
    </div>
  );
}

export const blogCustomComponents = {
  MyThought,
  Short,
  Long,
  Year,
  Month,
  Age,
  BooksLeftToRead,
  Resource,
};
