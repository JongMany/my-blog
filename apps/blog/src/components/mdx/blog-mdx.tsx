import { MDX } from "@srf/ui";
import { blogRuntimeConfig } from "./blog-mdx-config";
import { blogCustomComponents } from "./blog-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { ComponentMap } from "@srf/ui";

export type FrontmatterData = Record<string, unknown>;

interface BlogMDXProps
  extends Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> {
  overrides?: ComponentMap;
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
}

export function BlogMDX({
  frontmatter,
  scope,
  overrides,
  ...props
}: BlogMDXProps) {
  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      config={{
        runtime: blogRuntimeConfig,
        custom: blogCustomComponents,
      }}
      overrides={overrides}
    />
  );
}
