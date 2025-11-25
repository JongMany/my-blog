import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import type { FrontmatterData } from "./lib/types";
import { createMdxComponentMap } from "./mdx-components/componentMap";

function MDX({
  scope = {},
  ...props
}: Omit<MDXRemoteProps, "scope"> & { scope?: FrontmatterData }) {
  return (
    <MDXRemote {...props} scope={scope} components={createMdxComponentMap()} />
  );
}

export { MDX };
