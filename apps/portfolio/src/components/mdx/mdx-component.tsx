import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import type { FrontmatterData } from "./lib/types";
import { createMdxComponentMap } from "./mdx-components/component-map";

type MDXProps = Omit<MDXRemoteProps, "scope" | "frontmatter"> & {
  scope?: FrontmatterData;
  frontmatter?: FrontmatterData;
};

function MDX({ scope = {}, frontmatter, ...props }: MDXProps) {
  return (
    <MDXRemote
      {...props}
      scope={scope}
      frontmatter={frontmatter ?? {}}
      components={createMdxComponentMap()}
    />
  );
}

export { MDX };
