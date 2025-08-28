import { MDXProvider } from "@mdx-js/react";
import type { ComponentProps } from "react";

// MDXProvider의 props에서 components 타입을 추론
type ComponentsProp = ComponentProps<typeof MDXProvider>["components"];

// 원하는 컴포넌트 오버라이드 맵
const components: NonNullable<ComponentsProp> = {
  a: (props) => (
    <a {...props} className="text-sky-400 underline-offset-4 hover:underline" />
  ),
  img: (props) => (
    <img
      {...props}
      className="rounded-lg border border-white/10"
      loading="lazy"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="rounded-lg border border-white/10 p-4 overflow-x-auto"
    />
  ),
  code: (props) => <code {...props} className="rounded px-1 py-0.5" />,
};

export function MDXTheme({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
