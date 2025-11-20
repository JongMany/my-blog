import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // MDX 콘텐츠가 렌더링될 때까지 대기
    const extractHeadings = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const headingElements = article.querySelectorAll<HTMLElement>(
        "h1, h2, h3, h4, h5, h6",
      );

      const extractedHeadings: Heading[] = Array.from(headingElements).map(
        (el) => {
          const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
          return {
            id,
            text: el.textContent || "",
            level: parseInt(el.tagName.charAt(1)),
          };
        },
      );

      setHeadings(extractedHeadings);
    };

    // 초기 실행
    extractHeadings();

    // MutationObserver로 DOM 변경 감지 (MDX가 비동기로 렌더링될 수 있음)
    const observer = new MutationObserver(() => {
      extractHeadings();
    });

    const article = document.querySelector("article");
    if (article) {
      observer.observe(article, {
        childList: true,
        subtree: true,
      });
    }

    // 짧은 지연 후에도 한 번 더 시도 (MDX 렌더링 완료 대기)
    const timeout = setTimeout(extractHeadings, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-8">
      <div className="w-64 pl-8">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
          목차
        </h3>
        <ul className="space-y-2 text-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className="text-left text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors break-words"
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

