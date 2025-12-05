export { MDX } from "./MDX";
export { useSerializedMDX } from "./hooks/use-serialized-mdx";
export { serialize, createDefaultSerializeOptions } from "./lib/serializer/serialize";
export { createComponentMap, useComponentMap } from "./lib/factory/create-component-map";
export { isExternalLink, injectRuntimeConfig } from "./lib/utils";
export type {
  RuntimeConfig,
  SerializeOptions,
  ComponentMapConfig,
  ComponentMap,
  LinkProps,
} from "./types";

