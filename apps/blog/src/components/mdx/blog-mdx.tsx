import { MDX } from "@srf/ui";
import { blogRuntimeConfig } from "./blog-mdx-config";
import { blogCustomComponents } from "./blog-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { ComponentType } from "react";

/**
 * Frontmatter 데이터 타입
 * portfolio와 일관성을 위해 별도 타입으로 정의
 */
export type FrontmatterData = Record<string, unknown>;

interface BlogMDXProps
  extends Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> {
  /**
   * 추가로 주입할 컴포넌트 맵
   * 기존 blogCustomComponents에 병합됩니다.
   */
  additionalComponents?: Record<string, ComponentType<any>>;
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
}

export function BlogMDX({
  frontmatter,
  scope,
  additionalComponents,
  ...props
}: BlogMDXProps) {
  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      componentMapOptions={{
        runtimeConfig: blogRuntimeConfig,
        customComponents: blogCustomComponents,
      }}
      additionalComponents={additionalComponents}
    />
  );
}
