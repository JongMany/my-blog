import { MDX } from "@srf/ui";
import { portfolioRuntimeConfig } from "./portfolio-mdx-config";
import { portfolioCustomComponents } from "./portfolio-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { FrontmatterData } from "./lib/types";
import type { ComponentMap } from "@srf/ui";

interface PortfolioMDXProps
  extends Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> {
  overrides?: ComponentMap;
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
}

export function PortfolioMDX({
  frontmatter,
  scope,
  overrides,
  ...props
}: PortfolioMDXProps) {
  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      config={{
        runtime: portfolioRuntimeConfig,
        custom: portfolioCustomComponents,
      }}
      overrides={overrides}
    />
  );
}
