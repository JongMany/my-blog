import { Dialog, DialogTrigger, DialogContent, DialogTitle, cn } from "@srf/ui";
import { Link } from "react-router-dom";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import {
  DetailedHTMLProps,
  ReactNode,
  VideoHTMLAttributes,
  Children,
  isValidElement,
  ComponentPropsWithoutRef,
} from "react";
import { useBoolean } from "@mfe/shared";
import { MermaidDiagram } from "./mdx-theme/mermaid-components/MermaidDiagram";
import {
  normalizeClassName,
  isExternalUrl,
  processImageSource,
  createImageStyle,
  extractTextFromChildren,
  normalizeMermaidCode,
} from "../utils/mdx";

// ============================================================================
// Types
// ============================================================================

interface MermaidDataAttributes {
  "data-mermaid"?: string;
  "data-mermaid-code"?: string;
  "data-mermaid-width"?: string;
  "data-mermaid-height"?: string;
  "data-language"?: string;
  "data-lang"?: string;
  "data-skip-pretty-code"?: string;
}

interface CodeElementProps {
  className?: string | string[];
  children?: ReactNode;
  "data-language"?: string;
  "data-lang"?: string;
  "data-skip-pretty-code"?: string;
}

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  source?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
};

// ============================================================================
// Constants
// ============================================================================

const HEADING_STYLES = {
  h1: "text-3xl font-bold mb-6 mt-8 first:mt-0 text-gray-900 dark:text-gray-100",
  h2: "text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100",
  h3: "text-xl font-medium mb-3 mt-6 text-gray-900 dark:text-gray-100",
  h4: "text-lg font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100",
  h5: "text-base font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100",
  h6: "text-sm font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100",
} as const;

const CODE_BLOCK_STYLES = {
  prettyCode: "overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 mb-4 my-6 shadow-lg",
  default:
    "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 my-6 shadow-md",
} as const;

const CODE_INLINE_STYLE =
  "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100";

const CODE_BLOCK_STYLE =
  "block text-sm font-mono leading-relaxed text-gray-100";

const LINK_STYLE =
  "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline";

// ============================================================================
// Types
// ============================================================================

interface ElementWithChildren {
  children?: ReactNode;
  src?: string;
  alt?: string;
}

function isMermaidCodeBlock(
  props: MermaidDataAttributes & { className?: string | string[] },
): boolean {
  const className = normalizeClassName(props.className);
  const dataLanguage = props["data-language"] || props["data-lang"] || "";
  const skipMarker = props["data-skip-pretty-code"] === "true";
  const mermaidMarker = props["data-mermaid"] === "true";

  return (
    mermaidMarker ||
    skipMarker ||
    className.includes("language-mermaid") ||
    className.includes("mermaid") ||
    dataLanguage === "mermaid"
  );
}


// ============================================================================
// Component Factories
// ============================================================================

function createHeadingComponent(level: keyof typeof HEADING_STYLES) {
  return function Heading(props: ComponentPropsWithoutRef<typeof level>) {
    const Tag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag {...props} className={cn(HEADING_STYLES[level], props.className)} />
    );
  };
}

// ============================================================================
// MDX Components
// ============================================================================

export function MDX({
  scope = {},
  ...props
}: Omit<MDXRemoteProps, "scope"> & { scope?: Record<string, unknown> }) {
  return (
    <MDXRemote
      {...props}
      scope={scope}
      components={{
        Image,
        img: Image,
        Link: MDXLink,
        Video,
        Mermaid,
        h1: createHeadingComponent("h1"),
        h2: createHeadingComponent("h2"),
        h3: createHeadingComponent("h3"),
        h4: createHeadingComponent("h4"),
        h5: createHeadingComponent("h5"),
        h6: createHeadingComponent("h6"),
        p: (p) => {
          const childrenArray = Children.toArray(p.children);
          const hasImage = childrenArray.some((child) => {
            if (!isValidElement(child)) return false;

            const childType = child.type;
            const childProps = child.props as ElementWithChildren;

            const isImageComponent =
              childType === Image ||
              childType === "img" ||
              childType === "Image" ||
              (typeof childType === "string" &&
                childType.toLowerCase().includes("image")) ||
              Boolean(childProps?.src);

            if (isImageComponent) return true;

            if (childProps?.children) {
              const nestedChildren = Children.toArray(childProps.children);
              return nestedChildren.some((nested) => {
                if (!isValidElement(nested)) return false;
                const nestedProps = nested.props as ElementWithChildren;
                return (
                  nested.type === Image ||
                  nested.type === "img" ||
                  nested.type === "Image" ||
                  Boolean(nestedProps?.src)
                );
              });
            }

            return false;
          });

          const paragraphClassName = cn(
            "mb-4 leading-relaxed text-gray-700 dark:text-gray-300",
            p.className,
          );

          if (hasImage) {
            return (
              <div
                {...(p as React.HTMLAttributes<HTMLDivElement>)}
                className={paragraphClassName}
              >
                {p.children}
              </div>
            );
          }

          return <p {...p} className={paragraphClassName} />;
        },
        ul: (p) => (
          <ul
            {...p}
            className={cn(
              "list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300",
              p.className,
            )}
          />
        ),
        ol: (p) => (
          <ol
            {...p}
            className={cn(
              "list-decimal pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300",
              p.className,
            )}
          />
        ),
        li: (p) => <li {...p} className={cn("leading-relaxed", p.className)} />,
        blockquote: (p) => (
          <blockquote
            {...p}
            className={cn(
              "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400",
              p.className,
            )}
          />
        ),
        table: (p) => (
          <div className="overflow-x-auto mb-4">
            <table
              {...p}
              className={cn(
                "min-w-full border-collapse border border-gray-300 dark:border-gray-700",
                p.className,
              )}
            />
          </div>
        ),
        thead: (p) => (
          <thead
            {...p}
            className={cn("bg-gray-50 dark:bg-gray-800", p.className)}
          />
        ),
        tbody: (p) => <tbody {...p} />,
        tr: (p) => (
          <tr
            {...p}
            className={cn(
              "border-b border-gray-200 dark:border-gray-700",
              p.className,
            )}
          />
        ),
        th: (p) => (
          <th
            {...p}
            className={cn(
              "px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
              p.className,
            )}
          />
        ),
        td: (p) => (
          <td
            {...p}
            className={cn(
              "px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300",
              p.className,
            )}
          />
        ),
        a: (p) => (
          <a
            {...p}
            className={cn(LINK_STYLE, p.className)}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        hr: (p) => (
          <hr
            {...p}
            className={cn(
              "my-8 border-gray-300 dark:border-gray-700",
              p.className,
            )}
          />
        ),
        strong: (p) => (
          <strong
            {...p}
            className={cn(
              "font-semibold text-gray-900 dark:text-gray-100",
              p.className,
            )}
          />
        ),
        em: (p) => <em {...p} className={cn("italic", p.className)} />,
        pre: Pre,
        div: Div,
        code: Code,
      }}
    />
  );
}

// ============================================================================
// Custom Components
// ============================================================================

function Image({
  alt,
  src,
  source,
  description,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  const { value: opened, toggle, setFalse: close } = useBoolean(false);
  const processedSrc = processImageSource(src);
  const imageStyle = createImageStyle(width, height);

  if (!processedSrc) return null;

  return (
    <div className="flex w-full max-w-full flex-col items-center overflow-hidden my-8">
      <Dialog modal={false} open={opened} onOpenChange={toggle}>
        <DialogTrigger asChild>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className={cn(
              "mb-1 h-auto w-full max-w-full cursor-pointer rounded-lg object-contain shadow-md hover:shadow-lg transition-shadow",
              className,
            )}
            style={imageStyle}
            width={width}
            height={height}
            loading="lazy"
            {...props}
          />
        </DialogTrigger>
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center outline-none bg-transparent p-0 shadow-none max-w-none"
          overlayClassName="bg-black/50"
          hideClose
        >
          <DialogTitle className="sr-only">{alt ?? ""}</DialogTitle>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className="h-auto max-h-full w-auto max-w-full object-contain"
            onClick={close}
          />
        </DialogContent>
      </Dialog>
      {source && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          [출처: {source}]
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {description}
        </p>
      )}
    </div>
  );
}

function Video({
  src,
  ...props
}: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) {
  return (
    <video
      src={src}
      className="h-auto w-full rounded-lg my-8 shadow-md"
      playsInline
      {...props}
    />
  );
}

function Mermaid({
  children,
  width,
  height,
  ...props
}: {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <MermaidDiagram width={width} height={height} {...props}>
      {normalizeMermaidCode(children)}
    </MermaidDiagram>
  );
}

function Div({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  MermaidDataAttributes & { children?: ReactNode }) {
  const mermaidCode = props["data-mermaid-code"];
  const mermaidWidth = props["data-mermaid-width"];
  const mermaidHeight = props["data-mermaid-height"];

  if (isMermaidCodeBlock(props) && mermaidCode) {
    return (
      <MermaidDiagram width={mermaidWidth} height={mermaidHeight}>
        {mermaidCode}
      </MermaidDiagram>
    );
  }

  return <div {...props}>{children}</div>;
}

function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> &
  MermaidDataAttributes & { children?: ReactNode }) {
  const childrenArray = Children.toArray(children);

  for (const child of childrenArray) {
    if (!isValidElement(child) || child.type !== "code") continue;

    const childProps = child.props as CodeElementProps;
    const combinedProps: MermaidDataAttributes & {
      className?: string | string[];
    } = {
      className: childProps?.className,
      "data-language": childProps?.["data-language"] || props["data-language"],
      "data-lang": childProps?.["data-lang"] || props["data-lang"],
      "data-skip-pretty-code":
        childProps?.["data-skip-pretty-code"] || props["data-skip-pretty-code"],
    };

    if (isMermaidCodeBlock(combinedProps)) {
      const childText = extractTextFromChildren(childProps?.children || "");
      if (childText.trim()) {
        return <MermaidDiagram>{childText}</MermaidDiagram>;
      }
    }
  }

  const hasCodeChild = childrenArray.some(
    (child) =>
      isValidElement(child) &&
      (child.type === "code" ||
        normalizeClassName(
          (child.props as CodeElementProps)?.className,
        ).includes("language-")),
  );

  const style = hasCodeChild
    ? CODE_BLOCK_STYLES.prettyCode
    : CODE_BLOCK_STYLES.default;

  return (
    <pre {...props} className={cn(style, props.className)}>
      {children}
    </pre>
  );
}

function Code({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  "data-language"?: string;
  "data-lang"?: string;
}) {
  const classStr = normalizeClassName(className);
  const isInline = !classStr.includes("language-");

  if (isMermaidCodeBlock({ className, ...props })) {
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  }

  const style = isInline ? CODE_INLINE_STYLE : CODE_BLOCK_STYLE;
  return (
    <code {...props} className={cn(style, className)}>
      {children}
    </code>
  );
}

function MDXLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_STYLE}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href ?? "#"} className={LINK_STYLE} {...props}>
      {children}
    </Link>
  );
}
