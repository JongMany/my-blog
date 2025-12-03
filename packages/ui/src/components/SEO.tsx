import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  siteName?: string;
  /** 발행일 (ISO 8601 형식) */
  publishedTime?: string;
  /** 수정일 (ISO 8601 형식) */
  modifiedTime?: string;
}

const defaultSEO = {
  title: "이종민 - Frontend Developer | 포트폴리오 & 블로그",
  description:
    "사용자 경험을 최우선으로 생각하는 Frontend Developer 이종민입니다. 암호화폐 거래소와 AI 채팅 플랫폼에서 핵심 기능을 개발한 경험을 공유합니다.",
  keywords:
    "프론트엔드 개발자, React, TypeScript, 포트폴리오, 블로그, 이종민, Frontend Developer",
  image: "https://jongmany.github.io/my-blog/img/profile.jpeg",
  url: "https://jongmany.github.io/my-blog/",
  type: "website" as const,
  author: "이종민",
  siteName: "이종민 포트폴리오",
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
  author,
  siteName,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  useEffect(() => {
    // SEO 데이터를 문자열로 변환하여 의존성 비교를 안정화
    const seoData = {
      title: title
        ? `${title} | ${siteName || defaultSEO.siteName}`
        : defaultSEO.title,
      description: description || defaultSEO.description,
      keywords: keywords || defaultSEO.keywords,
      image: image || defaultSEO.image,
      url: url || defaultSEO.url,
      type: type || defaultSEO.type,
      author: author || defaultSEO.author,
      siteName: siteName || defaultSEO.siteName,
    };

    // 직접 DOM 조작으로 SEO 메타데이터 업데이트
    const updateDocumentHead = () => {
      // Title 업데이트
      if (seoData.title) {
        document.title = seoData.title;
      }

      // Meta tags 업데이트
      const updateMetaTag = (
        name: string,
        content: string,
        property?: boolean,
      ) => {
        const selector = property
          ? `meta[property="${name}"]`
          : `meta[name="${name}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;

        if (!meta) {
          meta = document.createElement("meta");
          if (property) {
            meta.setAttribute("property", name);
          } else {
            meta.setAttribute("name", name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      };

      // 기본 메타데이터
      if (seoData.description)
        updateMetaTag("description", seoData.description);
      if (seoData.keywords) updateMetaTag("keywords", seoData.keywords);
      if (seoData.author) updateMetaTag("author", seoData.author);

      // Open Graph 메타데이터
      if (seoData.title) updateMetaTag("og:title", seoData.title, true);
      if (seoData.description)
        updateMetaTag("og:description", seoData.description, true);
      if (seoData.type) updateMetaTag("og:type", seoData.type, true);
      if (seoData.url) updateMetaTag("og:url", seoData.url, true);
      if (seoData.image) updateMetaTag("og:image", seoData.image, true);
      if (seoData.siteName)
        updateMetaTag("og:site_name", seoData.siteName, true);
      updateMetaTag("og:locale", "ko_KR", true);

      // Article 메타데이터 (블로그 포스트용)
      if (seoData.type === "article") {
        if (publishedTime)
          updateMetaTag("article:published_time", publishedTime, true);
        if (modifiedTime)
          updateMetaTag("article:modified_time", modifiedTime, true);
        if (seoData.author)
          updateMetaTag("article:author", seoData.author, true);
      }

      // Twitter Card 메타데이터
      updateMetaTag("twitter:card", "summary_large_image");
      if (seoData.title) updateMetaTag("twitter:title", seoData.title);
      if (seoData.description)
        updateMetaTag("twitter:description", seoData.description);
      if (seoData.image) updateMetaTag("twitter:image", seoData.image);

      // 추가 SEO 메타데이터
      updateMetaTag("robots", "index, follow");
      updateMetaTag("theme-color", "#000000");

      // Canonical URL
      let canonical = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      if (seoData.url) {
        canonical.setAttribute("href", seoData.url);
      }
    };

    updateDocumentHead();
  }, [
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    siteName,
    publishedTime,
    modifiedTime,
  ]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 SEO 데이터만 업데이트
  return null;
}

/**
 * 블로그 포스트용 JSON-LD 구조화된 데이터 컴포넌트
 */
export interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
  tags?: string[];
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  authorName = "이종민",
  tags = [],
}: ArticleJsonLdProps) {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: description,
      image: image || defaultSEO.image,
      url: url,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        "@type": "Person",
        name: authorName,
        url: "https://jongmany.github.io/my-blog/",
      },
      publisher: {
        "@type": "Person",
        name: authorName,
        logo: {
          "@type": "ImageObject",
          url: defaultSEO.image,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      keywords: tags.join(", "),
      inLanguage: "ko-KR",
    };

    // 기존 JSON-LD 스크립트 제거 후 새로 추가
    const existingScript = document.querySelector(
      'script[data-json-ld="article"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-json-ld", "article");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [
    title,
    description,
    url,
    image,
    publishedTime,
    modifiedTime,
    authorName,
    tags,
  ]);

  return null;
}

/**
 * 웹사이트 기본 JSON-LD 구조화된 데이터 컴포넌트
 */
export interface WebsiteJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
}

export function WebsiteJsonLd({
  name = "이종민 블로그",
  description = defaultSEO.description,
  url = "https://jongmany.github.io/my-blog/blog/",
}: WebsiteJsonLdProps) {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: name,
      description: description,
      url: url,
      author: {
        "@type": "Person",
        name: "이종민",
        jobTitle: "Frontend Developer",
        url: "https://jongmany.github.io/my-blog/",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${url}?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "ko-KR",
    };

    const existingScript = document.querySelector(
      'script[data-json-ld="website"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-json-ld", "website");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [name, description, url]);

  return null;
}

/**
 * 개인(Person) JSON-LD 구조화된 데이터 컴포넌트
 */
export function PersonJsonLd() {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "이종민",
      jobTitle: "Frontend Developer",
      description:
        "사용자 경험을 최우선으로 생각하는 Frontend Developer입니다.",
      url: "https://jongmany.github.io/my-blog/",
      image: defaultSEO.image,
      sameAs: ["https://github.com/jongmany"],
      knowsAbout: [
        "React",
        "TypeScript",
        "JavaScript",
        "Frontend Development",
        "Web Development",
        "TradingView",
      ],
    };

    const existingScript = document.querySelector(
      'script[data-json-ld="person"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-json-ld", "person");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

/**
 * BreadcrumbList JSON-LD 구조화된 데이터 컴포넌트
 */
export interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    const existingScript = document.querySelector(
      'script[data-json-ld="breadcrumb"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-json-ld", "breadcrumb");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [items]);

  return null;
}
