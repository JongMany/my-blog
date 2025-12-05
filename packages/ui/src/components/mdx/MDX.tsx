import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import type { ComponentMap } from "./types";

interface MDXProps extends Omit<MDXRemoteProps, "components"> {
  components: ComponentMap;
}

export function MDX({ components, ...props }: MDXProps) {
  return <MDXRemote {...props} components={components} />;
}
