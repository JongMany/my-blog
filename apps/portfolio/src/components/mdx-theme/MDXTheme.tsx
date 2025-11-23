import { MDXProvider } from "@mdx-js/react";
import { imageSource, useBoolean } from "@mfe/shared";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@srf/ui";
import * as React from "react";
import { MermaidDiagram } from "./mermaid-components/MermaidDiagram";
import { SimpleMermaid } from "./mermaid-components/SimpleMermaid";

// MDX에서 직접 사용할 수 있는 Mermaid 컴포넌트
export const Mermaid = ({ children }: { children: React.ReactNode }) => (
  <MermaidDiagram>{children}</MermaidDiagram>
);

type ComponentsProp = Parameters<typeof MDXProvider>[0]["components"];
type MDXMap = NonNullable<ComponentsProp>;

type PortfolioImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  source?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
};

function processImageSource(src?: string): string | undefined {
  if (!src) return undefined;

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  return imageSource(src, "portfolio", {
    isDevelopment: import.meta.env.MODE === "development",
  });
}

function createImageStyle(
  width?: number | string,
  height?: number | string,
): React.CSSProperties | undefined {
  const style: React.CSSProperties = {};

  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }

  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;

const INLINE_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "cite",
  "code",
  "em",
  "i",
  "kbd",
  "mark",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
]);

function isInlineNode(node: React.ReactNode): boolean {
  if (node === null || node === undefined || typeof node === "boolean") {
    return true;
  }
  if (typeof node === "string" || typeof node === "number") {
    return true;
  }
  if (!React.isValidElement(node)) {
    return false;
  }

  const element = node as React.ReactElement<{ children?: React.ReactNode }>;
  const elementType = element.type;

  if (elementType === React.Fragment) {
    return React.Children.toArray(element.props.children).every(isInlineNode);
  }

  if (typeof elementType === "string") {
    return INLINE_TAGS.has(elementType);
  }

  // 커스텀 컴포넌트(예: Image)는 블록 요소로 간주
  return false;
}

function Paragraph({ children, className = "", ...props }: ParagraphProps) {
  const childArray = React.Children.toArray(children);
  const meaningfulChildren = childArray.filter((child) => {
    if (child === null || child === undefined) return false;
    if (typeof child === "boolean") return false;
    if (typeof child === "string") {
      return child.trim().length > 0;
    }
    return true;
  });

  const shouldBeInline =
    meaningfulChildren.length === 0 ||
    meaningfulChildren.every((child) => isInlineNode(child));

  const Wrapper = shouldBeInline ? "p" : "div";
  const wrapperClassName = `mb-4 leading-relaxed ${className}`.trim();

  return (
    <Wrapper {...props} className={wrapperClassName}>
      {children}
    </Wrapper>
  );
}

function Image({
  alt,
  src,
  source,
  description,
  width,
  height,
  className,
  ...props
}: PortfolioImageProps) {
  const { value: opened, toggle, setFalse: close } = useBoolean(false);
  const processedSrc = processImageSource(src);
  const imageStyle = createImageStyle(width, height);

  if (!processedSrc) return null;

  return (
    <div className="flex w-full max-w-full flex-col items-center overflow-hidden">
      <Dialog modal={false} open={opened} onOpenChange={toggle}>
        <DialogTrigger asChild>
          <img
            alt={alt ?? ""}
            src={processedSrc}
            className={`mb-1 mt-8 h-auto w-full max-w-full cursor-pointer rounded-lg object-contain ${className ?? ""}`}
            style={imageStyle}
            width={width}
            height={height}
            loading="lazy"
            {...props}
          />
        </DialogTrigger>
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-transparent p-0 shadow-none outline-none"
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
      {source && <p className="text-xs text-gray-500">[출처: {source}]</p>}
      {description && (
        <p className="text-xs text-gray-500 text-center">{description}</p>
      )}
    </div>
  );
}

export const components: MDXMap = {
  // MDX에서 직접 사용할 수 있는 컴포넌트들
  Mermaid,
  SimpleMermaid,
  Image,
  /* === Headings === */
  h1: (p) => <h1 {...p} className="text-3xl font-bold mb-6 mt-8 first:mt-0" />,
  h2: (p) => <h2 {...p} className="text-2xl font-semibold mb-4 mt-8" />,
  h3: (p) => <h3 {...p} className="text-xl font-medium mb-3 mt-6" />,
  h4: (p) => <h4 {...p} className="text-lg font-medium mb-2 mt-4" />,
  h5: (p) => <h5 {...p} className="text-base font-medium mb-2 mt-4" />,
  h6: (p) => <h6 {...p} className="text-sm font-medium mb-2 mt-4" />,

  /* === Text === */
  p: Paragraph,
  strong: (p) => <strong {...p} className="font-semibold" />,
  em: (p) => <em {...p} className="italic" />,

  /* === Lists === */
  ul: (p) => <ul {...p} className="list-disc pl-6 mb-4 space-y-2" />,
  ol: (p) => <ol {...p} className="list-decimal pl-6 mb-4 space-y-2" />,
  li: (p) => <li {...p} className="leading-relaxed" />,

  /* === Code === */
  code: (p) => (
    <code
      {...p}
      className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
    />
  ),

  /* === Blockquotes === */
  blockquote: (p) => (
    <blockquote
      {...p}
      className="border-l-4 border-blue-500 pl-4 italic my-4"
    />
  ),

  /* === Media === */
  img: (props) => <Image {...props} />,

  /* === Tables === */
  table: (p) => (
    <div className="overflow-x-auto mb-4">
      <table
        {...p}
        className="min-w-full border-collapse border border-gray-300"
      />
    </div>
  ),
  thead: (p) => <thead {...p} className="bg-gray-50 dark:bg-gray-800" />,
  tbody: (p) => <tbody {...p} />,
  tr: (p) => (
    <tr {...p} className="border-b border-gray-200 dark:border-gray-700" />
  ),
  th: (p) => (
    <th
      {...p}
      className="px-4 py-2 text-left font-semibold border border-gray-300"
    />
  ),
  td: (p) => <td {...p} className="px-4 py-2 border border-gray-300" />,

  /* === Links === */
  a: (p) => (
    <a
      {...p}
      className="text-blue-600 hover:text-blue-800 underline"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),

  /* === Horizontal Rule === */
  hr: (p) => <hr {...p} className="my-8 border-gray-300" />,

  /* === Details/Summary (Toggle) === */
  details: ({ children, ...p }) => (
    <details
      {...p}
      className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      {React.Children.map(children, (child, index) => {
        if (
          index === 0 &&
          React.isValidElement(child) &&
          child.type === "summary"
        ) {
          return child;
        }

        // pre 태그인 경우 특별한 클래스 추가
        if (React.isValidElement(child) && child.type === "pre") {
          const existingClassName =
            (child.props as { className?: string })?.className || "";
          return (
            <div key={index} className="ml-6 mr-4 mb-4 first:mt-4">
              {React.cloneElement(
                child as React.ReactElement<{ className?: string }>,
                {
                  className: `${existingClassName} details-content`,
                },
              )}
            </div>
          );
        }

        return (
          <div key={index} className="ml-6 mr-4 mb-4 first:mt-4">
            {child}
          </div>
        );
      })}
    </details>
  ),
  summary: (p) => (
    <summary
      {...p}
      className="cursor-pointer bg-gray-50 dark:bg-gray-800 px-4 py-3 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
    />
  ),

  /* === Mermaid Diagrams === */
  pre: (p) => {
    const children = React.Children.toArray(p.children);

    // 모든 children을 확인하여 mermaid 요소 찾기
    let mermaidElement = null;
    let mermaidChildren = "";

    for (const child of children) {
      if (React.isValidElement(child)) {
        const className = (child.props as any)?.className || "";
        const childChildren = (child.props as any)?.children || "";

        if (
          className.includes("language-mermaid") ||
          className.includes("mermaid") ||
          (typeof childChildren === "string" &&
            (childChildren.includes("mindmap") ||
              childChildren.includes("flowchart") ||
              childChildren.includes("graph") ||
              childChildren.includes("root((") ||
              childChildren.includes("-->") ||
              childChildren.includes("subgraph")))
        ) {
          mermaidElement = child;
          mermaidChildren =
            typeof childChildren === "string" ? childChildren : "";
          break;
        }
      }
    }

    if (mermaidElement) {
      return <MermaidDiagram>{mermaidChildren}</MermaidDiagram>;
    } else {
    }

    // details 안에 있는 pre인지 확인 (부모가 details인지 체크)
    const isInsideDetails = p.className?.includes("details-content") || false;

    return (
      <pre
        {...p}
        className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 ml-4 m-2 ${
          isInsideDetails
            ? "border-l-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
            : ""
        }`}
      />
    );
  },
};

export function MDXTheme({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
