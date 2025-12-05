import { useMemo } from "react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { useComponentMap } from "./lib/factory/create-component-map";
import type { ComponentMapConfig, ComponentMap } from "./types";

interface MDXProps extends Omit<MDXRemoteProps, "components" | "scope"> {
  config: ComponentMapConfig;
  overrides?: ComponentMap;
  scope?: Record<string, unknown>;
}

export function MDX({ config, overrides, scope, ...props }: MDXProps) {
  const baseMap = useComponentMap(config);
  
  const components = useMemo(
    () => (overrides ? { ...baseMap, ...overrides } : baseMap),
    [baseMap, overrides]
  );
  
  return <MDXRemote {...props} components={components} scope={scope ?? {}} />;
}

