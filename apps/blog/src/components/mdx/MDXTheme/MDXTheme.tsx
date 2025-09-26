import * as React from "react";
import { MDXProvider } from "@mdx-js/react";
import { components } from "./components";

export function MDXTheme({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
