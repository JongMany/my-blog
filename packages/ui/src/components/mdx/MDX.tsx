import { useMemo } from "react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { useMDXComponentMap } from "./lib/factory/create-component-map";
import { mergeComponents } from "./lib/utils/merge-components";
import type { ComponentMapOptions } from "./types";
import type { ComponentType } from "react";

interface MDXProps extends Omit<MDXRemoteProps, "components" | "scope"> {
  componentMapOptions: ComponentMapOptions;
  additionalComponents?: Record<string, ComponentType<any>>;
  scope?: Record<string, unknown>;
}

export function MDX({
  componentMapOptions,
  additionalComponents,
  scope,
  ...props
}: MDXProps) {
  const baseComponentMap = useMDXComponentMap(componentMapOptions);
  
  const finalComponentMap = useMemo(
    () => mergeComponents(baseComponentMap, additionalComponents),
    [baseComponentMap, additionalComponents]
  );
  
  return <MDXRemote {...props} components={finalComponentMap} scope={scope ?? {}} />;
}

