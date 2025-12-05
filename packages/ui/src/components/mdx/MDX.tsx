import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { useMDXComponentMap } from "./lib/factory/create-component-map";
import type { ComponentMapOptions } from "./types";

interface MDXProps extends Omit<MDXRemoteProps, "components" | "scope"> {
  componentMapOptions: ComponentMapOptions;
  scope?: Record<string, unknown>;
}

export function MDX({ componentMapOptions, scope, ...props }: MDXProps) {
  const componentMap = useMDXComponentMap(componentMapOptions);
  
  return <MDXRemote {...props} components={componentMap} scope={scope ?? {}} />;
}

