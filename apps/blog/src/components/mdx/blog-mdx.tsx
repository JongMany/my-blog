import { MDX } from "@srf/ui";
import { blogRuntimeConfig } from "./blog-mdx-config";
import { blogCustomComponents } from "./blog-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";

export function BlogMDX(
  props: Omit<MDXRemoteProps, "components" | "scope"> & {
    scope?: Record<string, unknown>;
  },
) {
  return (
    <MDX
      {...props}
      componentMapOptions={{
        runtimeConfig: blogRuntimeConfig,
        customComponents: blogCustomComponents,
      }}
    />
  );
}
