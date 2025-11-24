import { Dialog, DialogTrigger, DialogContent, DialogTitle, cn } from "@srf/ui";
import { Link } from "react-router-dom";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import {
  DetailedHTMLProps,
  ReactNode,
  VideoHTMLAttributes,
  Children,
  isValidElement,
} from "react";
import { useBoolean, imageSource } from "@mfe/shared";
import { MermaidDiagram } from "./mdx-theme/mermaid-components/MermaidDiagram";

export function MDX({
  scope = {},
  ...props
}: Omit<MDXRemoteProps, "scope"> & { scope?: Record<string, any> }) {
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
        h1: (p) => (
          <h1
            {...p}
            className="text-3xl font-bold mb-6 mt-8 first:mt-0 text-gray-900 dark:text-gray-100"
          />
        ),
        h2: (p) => (
          <h2
            {...p}
            className="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100"
          />
        ),
        h3: (p) => (
          <h3
            {...p}
            className="text-xl font-medium mb-3 mt-6 text-gray-900 dark:text-gray-100"
          />
        ),
        h4: (p) => (
          <h4
            {...p}
            className="text-lg font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100"
          />
        ),
        h5: (p) => (
          <h5
            {...p}
            className="text-base font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100"
          />
        ),
        h6: (p) => (
          <h6
            {...p}
            className="text-sm font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100"
          />
        ),
        p: (p) => (
          <p
            {...p}
            className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
          />
        ),
        ul: (p) => (
          <ul
            {...p}
            className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300"
          />
        ),
        ol: (p) => (
          <ol
            {...p}
            className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300"
          />
        ),
        li: (p) => <li {...p} className="leading-relaxed" />,
        blockquote: (p) => (
          <blockquote
            {...p}
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
          />
        ),
        table: (p) => (
          <div className="overflow-x-auto mb-4">
            <table
              {...p}
              className="min-w-full border-collapse border border-gray-300 dark:border-gray-700"
            />
          </div>
        ),
        thead: (p) => <thead {...p} className="bg-gray-50 dark:bg-gray-800" />,
        tbody: (p) => <tbody {...p} />,
        tr: (p) => (
          <tr
            {...p}
            className="border-b border-gray-200 dark:border-gray-700"
          />
        ),
        th: (p) => (
          <th
            {...p}
            className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
        ),
        td: (p) => (
          <td
            {...p}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          />
        ),
        a: (p) => (
          <a
            {...p}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        hr: (p) => (
          <hr {...p} className="my-8 border-gray-300 dark:border-gray-700" />
        ),
        strong: (p) => (
          <strong
            {...p}
            className="font-semibold text-gray-900 dark:text-gray-100"
          />
        ),
        em: (p) => <em {...p} className="italic" />,
        pre: Pre,
        div: Div,
        code: Code,
      }}
    />
  );
}

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  source?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
};

function processImageSource(src?: string): string | undefined {
  if (!src) return undefined;

  const isExternalUrl = /^https?:\/\//i.test(src);
  if (isExternalUrl) return src;

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

function Mermaid({ children }: { children: ReactNode }) {
  const mermaidCode =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.join("")
        : String(children);

  return <MermaidDiagram>{mermaidCode}</MermaidDiagram>;
}

function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (isValidElement(children)) {
    const childProps = children.props as any;
    if (childProps?.children) {
      return extractTextFromChildren(childProps.children);
    }
  }
  return "";
}

// mermaid를 감지하는 div 컴포넌트 (rehypeSkipMermaid가 변환한 구조)
function Div({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  const mermaidCode = (props as any)?.["data-mermaid-code"];
  const isMermaid = (props as any)?.["data-mermaid"] === "true";

  if (isMermaid && mermaidCode) {
    return <MermaidDiagram>{mermaidCode}</MermaidDiagram>;
  }

  return <div {...props}>{children}</div>;
}

function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { children?: ReactNode }) {
  const childrenArray = Children.toArray(children);

  // pre 태그 자체에 mermaid 마커가 있는지 확인
  const preSkipMarker = (props as any)?.["data-skip-pretty-code"] === "true";

  // mermaid 코드 블록 감지 (가장 우선순위)
  for (const child of childrenArray) {
    if (isValidElement(child) && child.type === "code") {
      const childProps = child.props as any;
      const className = childProps?.className || "";
      const classArray = Array.isArray(className) ? className : [className];
      const classStr = classArray.join(" ");
      const dataLanguage =
        childProps?.["data-language"] ||
        childProps?.["data-lang"] ||
        (props as any)?.["data-language"] ||
        "";

      // mermaid 감지 (여러 조건 확인)
      const isMermaid =
        preSkipMarker ||
        classStr.includes("language-mermaid") ||
        classStr.includes("mermaid") ||
        dataLanguage === "mermaid" ||
        childProps?.["data-skip-pretty-code"] === "true" ||
        childProps?.["data-language"] === "mermaid";

      if (isMermaid) {
        const childText = extractTextFromChildren(childProps?.children || "");
        if (childText.trim()) {
          return <MermaidDiagram>{childText}</MermaidDiagram>;
        }
      }
    }
  }

  // rehypePrettyCode가 생성한 코드 블록
  const hasCodeChild = childrenArray.some(
    (child) =>
      isValidElement(child) &&
      (child.type === "code" ||
        (child.props as any)?.className?.includes("language-")),
  );

  if (hasCodeChild) {
    return (
      <pre
        {...props}
        className={cn(
          "overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 mb-4 my-6 shadow-lg",
          props.className,
        )}
      >
        {children}
      </pre>
    );
  }

  // 일반 코드 블록
  return (
    <pre
      {...props}
      className={cn(
        "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 my-6 shadow-md",
        props.className,
      )}
    >
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
  const classArray = Array.isArray(className) ? className : [className];
  const classStr = classArray.join(" ");
  const isInline = !classStr.includes("language-");
  const dataLanguage = props["data-language"] || props["data-lang"] || "";

  // mermaid인 경우 Pre에서 처리하도록 그대로 반환
  if (
    dataLanguage === "mermaid" ||
    classStr.includes("language-mermaid") ||
    classStr.includes("mermaid")
  ) {
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  }

  if (isInline) {
    return (
      <code
        {...props}
        className={cn(
          "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100",
          className,
        )}
      >
        {children}
      </code>
    );
  }

  // rehypePrettyCode가 생성한 코드 블록
  return (
    <code
      {...props}
      className={cn(
        "block text-sm font-mono leading-relaxed text-gray-100",
        className,
      )}
    >
      {children}
    </code>
  );
}

// MDX에서 사용할 Link 컴포넌트 (외부 링크는 일반 <a> 태그로 처리)
function MDXLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  // 외부 링크인 경우
  if (
    href?.startsWith("http://") ||
    href?.startsWith("https://") ||
    href?.startsWith("//")
  ) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        {...props}
      >
        {children}
      </a>
    );
  }

  // 내부 링크인 경우 React Router Link 사용
  return (
    <Link
      to={href ?? "#"}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
      {...props}
    >
      {children}
    </Link>
  );
}
