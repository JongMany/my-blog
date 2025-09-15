import { MDXProvider } from "@mdx-js/react";
import { imageSource } from "@mfe/shared";
import * as React from "react";
import { MermaidDiagram } from "./MermaidDiagram";
import { SimpleMermaid } from "./SimpleMermaid";

// MDX에서 직접 사용할 수 있는 Mermaid 컴포넌트
export const Mermaid = ({ children }: { children: React.ReactNode }) => (
  <MermaidDiagram>{children}</MermaidDiagram>
);

type ComponentsProp = Parameters<typeof MDXProvider>[0]["components"];
type MDXMap = NonNullable<ComponentsProp>;

function fixAssetSrc(src?: string) {
  if (!src) return src;
  
  console.log("fixAssetSrc 호출됨:", src);

  // 절대 URL인 경우 그대로 반환
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  // 모든 경로를 imageSource로 처리
  const result = imageSource(src, "portfolio", "http://localhost:3002");
  console.log("imageSource 결과:", result);
  return result;
}

export const components: MDXMap = {
  // MDX에서 직접 사용할 수 있는 컴포넌트들
  Mermaid,
  SimpleMermaid,
  /* === Headings === */
  h1: (p) => <h1 {...p} className="text-3xl font-bold mb-6 mt-8 first:mt-0" />,
  h2: (p) => <h2 {...p} className="text-2xl font-semibold mb-4 mt-8" />,
  h3: (p) => <h3 {...p} className="text-xl font-medium mb-3 mt-6" />,
  h4: (p) => <h4 {...p} className="text-lg font-medium mb-2 mt-4" />,
  h5: (p) => <h5 {...p} className="text-base font-medium mb-2 mt-4" />,
  h6: (p) => <h6 {...p} className="text-sm font-medium mb-2 mt-4" />,

  /* === Text === */
  p: (p) => <p {...p} className="mb-4 leading-relaxed" />,
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
  img: ({ src, ...p }) => {
    const processedSrc = fixAssetSrc(src);
    console.log("MDX 이미지 처리:", { src, processedSrc });
    return (
      <img
        {...p}
        src={processedSrc}
        className="max-w-full h-auto rounded-lg mb-4"
        loading="lazy"
      />
    );
  },

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

  /* === Mermaid Diagrams === */
  pre: (p) => {
    const children = React.Children.toArray(p.children);

    // 모든 children을 확인하여 mermaid 요소 찾기
    let mermaidElement = null;
    let mermaidClassName = "";
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
          mermaidClassName = className;
          mermaidChildren =
            typeof childChildren === "string" ? childChildren : "";
          break;
        }
      }
    }

    console.log("pre 컴포넌트 렌더링:", {
      hasMermaidElement: !!mermaidElement,
      mermaidClassName,
      mermaidChildren: mermaidChildren.substring(0, 50) + "...",
      allChildren: children,
    });

    if (mermaidElement) {
      console.log("✅ Mermaid 다이어그램 감지됨!");
      return <MermaidDiagram>{mermaidChildren}</MermaidDiagram>;
    } else {
      console.log("❌ Mermaid가 아닌 코드 블록");
    }

    return (
      <pre
        {...p}
        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"
      />
    );
  },
};

export function MDXTheme({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
