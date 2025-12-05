import { MDX } from "@srf/ui";
import { portfolioRuntimeConfig } from "./portfolio-mdx-config";
import { portfolioCustomComponents } from "./portfolio-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { FrontmatterData } from "./lib/types";

type PortfolioMDXProps = Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> & {
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
};

export function PortfolioMDX({ frontmatter, scope, ...props }: PortfolioMDXProps) {
  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      componentMapOptions={{
        runtimeConfig: portfolioRuntimeConfig,
        customComponents: portfolioCustomComponents,
        enableMermaid: true,
      }}
    />
  );
}

