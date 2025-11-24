import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import {
  ReactNode,
  Children,
  isValidElement,
  ComponentPropsWithoutRef,
} from "react";
import { MermaidDiagram } from "./mermaid/MermaidDiagram";
import { Image, Video, Mermaid, MDXLink } from "./components";
import {
  normalizeClassName,
  extractTextFromChildren,
  normalizeMermaidCode,
} from "./utils";
import { cn } from "@srf/ui";
import type {
  CodeElementProps,
  ElementWithChildren,
  FrontmatterData,
  MermaidDataAttributes,
} from "./types";

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

function isMermaid(
  props: MermaidDataAttributes & { className?: string | string[] },
): boolean {
  if (
    props["data-mermaid"] === "true" ||
    props["data-skip-pretty-code"] === "true"
  )
    return true;
  const cls = normalizeClassName(props.className);
  const lang = props["data-language"] || props["data-lang"] || "";
  return cls.includes("mermaid") || lang === "mermaid";
}

function hasImage(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    const type = child.type;
    const props = child.props as ElementWithChildren;
    if (
      type === "img" ||
      (typeof type === "string" && type.toLowerCase().includes("image")) ||
      props?.src
    )
      return true;
    return props?.children ? hasImage(props.children) : false;
  });
}

function createHeading(level: keyof typeof HEADING_STYLES) {
  return (
    props: ComponentPropsWithoutRef<typeof level> & { className?: string },
  ) => {
    const Tag = level;
    return (
      <Tag {...props} className={cn(HEADING_STYLES[level], props.className)} />
    );
  };
}

function MDX({
  scope = {},
  ...props
}: Omit<MDXRemoteProps, "scope"> & { scope?: FrontmatterData }) {
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
        h1: createHeading("h1"),
        h2: createHeading("h2"),
        h3: createHeading("h3"),
        h4: createHeading("h4"),
        h5: createHeading("h5"),
        h6: createHeading("h6"),
        p: (p) => {
          const className = cn(
            "mb-4 leading-relaxed text-gray-700 dark:text-gray-300",
            p.className,
          );
          return hasImage(p.children) ? (
            <div
              {...(p as React.HTMLAttributes<HTMLDivElement>)}
              className={className}
            >
              {p.children}
            </div>
          ) : (
            <p {...p} className={className} />
          );
        },
        ul: (props) => (
          <ul
            {...props}
            className={cn(
              "list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300",
              props.className,
            )}
          />
        ),
        ol: (props) => (
          <ol
            {...props}
            className={cn(
              "list-decimal pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300",
              props.className,
            )}
          />
        ),
        li: (props) => (
          <li {...props} className={cn("leading-relaxed", props.className)} />
        ),
        blockquote: (props) => (
          <blockquote
            {...props}
            className={cn(
              "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400",
              props.className,
            )}
          />
        ),
        table: (props) => (
          <div className="overflow-x-auto mb-4">
            <table
              {...props}
              className={cn(
                "min-w-full border-collapse border border-gray-300 dark:border-gray-700",
                props.className,
              )}
            />
          </div>
        ),
        thead: (props) => (
          <thead
            {...props}
            className={cn("bg-gray-50 dark:bg-gray-800", props.className)}
          />
        ),
        tbody: (props) => <tbody {...props} />,
        tr: (props) => (
          <tr
            {...props}
            className={cn(
              "border-b border-gray-200 dark:border-gray-700",
              props.className,
            )}
          />
        ),
        th: (props) => (
          <th
            {...props}
            className={cn(
              "px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
              props.className,
            )}
          />
        ),
        td: (props) => (
          <td
            {...props}
            className={cn(
              "px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300",
              props.className,
            )}
          />
        ),
        a: (props) => (
          <a
            {...props}
            className={cn(
              "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline",
              props.className,
            )}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        hr: (props) => (
          <hr
            {...props}
            className={cn(
              "my-8 border-gray-300 dark:border-gray-700",
              props.className,
            )}
          />
        ),
        strong: (props) => (
          <strong
            {...props}
            className={cn(
              "font-semibold text-gray-900 dark:text-gray-100",
              props.className,
            )}
          />
        ),
        em: (props) => (
          <em {...props} className={cn("italic", props.className)} />
        ),
        pre: Pre,
        div: Div,
        code: Code,
      }}
    />
  );
}

function Div({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  MermaidDataAttributes & { children?: ReactNode }) {
  const code = props["data-mermaid-code"];
  if (isMermaid(props) && code) {
    return (
      <MermaidDiagram
        width={props["data-mermaid-width"]}
        height={props["data-mermaid-height"]}
      >
        {code}
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
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child) || child.type !== "code") continue;
    const cp = child.props as CodeElementProps;
    if (
      isMermaid({
        className: cp?.className,
        "data-language": cp?.["data-language"] || props["data-language"],
        "data-lang": cp?.["data-lang"] || props["data-lang"],
        "data-skip-pretty-code":
          cp?.["data-skip-pretty-code"] || props["data-skip-pretty-code"],
      })
    ) {
      const text = extractTextFromChildren(cp?.children || "");
      if (text.trim()) return <MermaidDiagram>{text}</MermaidDiagram>;
    }
  }
  const hasCode = Children.toArray(children).some(
    (c) =>
      isValidElement(c) &&
      (c.type === "code" ||
        normalizeClassName((c.props as CodeElementProps)?.className).includes(
          "language-",
        )),
  );
  return (
    <pre
      {...props}
      className={cn(
        hasCode ? CODE_BLOCK_STYLES.prettyCode : CODE_BLOCK_STYLES.default,
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
  if (isMermaid({ className, ...props }))
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  const inline = !normalizeClassName(className).includes("language-");
  return (
    <code
      {...props}
      className={cn(inline ? CODE_INLINE_STYLE : CODE_BLOCK_STYLE, className)}
    >
      {children}
    </code>
  );
}

export { MDX };
