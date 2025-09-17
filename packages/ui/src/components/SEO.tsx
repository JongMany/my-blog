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
  }, [title, description, keywords, image, url, type, author, siteName]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 SEO 데이터만 업데이트
  return null;
}
