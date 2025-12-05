import { MDX } from "@srf/ui";
import { Video } from "@srf/ui";
import { Image } from "./custom";
import { portfolioCustomComponents } from "./portfolio-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { FrontmatterData } from "./lib/types";
import type { ComponentMap } from "@srf/ui";

interface PortfolioMDXProps
  extends Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> {
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
}

export function PortfolioMDX({
  frontmatter,
  scope,
  ...props
}: PortfolioMDXProps) {
  const components: ComponentMap = {
    Image,
    img: Image,
    Video,
    ...portfolioCustomComponents,
  };

  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      components={components}
    />
  );
}
