import { MDX } from "@srf/ui";
import { Image as BaseImage, Video, Link as BaseLink } from "@srf/ui";
import { blogRuntimeConfig, blogLinkComponent } from "./blog-mdx-config";
import { blogCustomComponents } from "./blog-mdx-components";
import type { MDXRemoteProps } from "next-mdx-remote";
import type { ComponentMap, FrontmatterData } from "@srf/ui";

interface BlogMDXProps
  extends Omit<MDXRemoteProps, "components" | "frontmatter" | "scope"> {
  frontmatter?: FrontmatterData;
  scope?: Record<string, unknown>;
}

const BlogImage = (props: React.ComponentProps<typeof BaseImage>) => (
  <BaseImage
    {...props}
    processImageSource={blogRuntimeConfig.processImageSource}
    appName={blogRuntimeConfig.appName}
  />
);

const BlogLink = (props: React.ComponentProps<typeof BaseLink>) => (
  <BaseLink {...props} linkComponent={blogLinkComponent} />
);

export function BlogMDX({ frontmatter, scope, ...props }: BlogMDXProps) {
  const components: ComponentMap = {
    Image: BlogImage,
    img: BlogImage,
    Video,
    Link: BlogLink,
    a: BlogLink,
    ...blogCustomComponents,
  };

  return (
    <MDX
      {...props}
      frontmatter={frontmatter ?? {}}
      scope={scope ?? {}}
      components={components}
    />
  );
}
