import { MDX } from "@srf/ui";
import { portfolioRuntimeConfig } from "./portfolio-mdx-config";
import { portfolioCustomComponents } from "./portfolio-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { FrontmatterData } from "./lib/types";
import type { ComponentType } from "react";

interface PortfolioMDXProps
  extends Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> {
  /**
   * 추가로 주입할 컴포넌트 맵
   * 기존 portfolioCustomComponents에 병합됩니다.
   */
  additionalComponents?: Record<string, ComponentType<any>>;
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
}

export function PortfolioMDX({
  frontmatter,
  scope,
  additionalComponents,
  ...props
}: PortfolioMDXProps) {
  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      componentMapOptions={{
        runtimeConfig: portfolioRuntimeConfig,
        customComponents: portfolioCustomComponents,
      }}
      additionalComponents={additionalComponents}
    />
  );
}

