import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
}

const defaultSEO = {
  title: "이종민 포트폴리오 | Frontend Developer 프로젝트 모음",
  description:
    "이종민의 포트폴리오입니다. TradingView 차트 주문 시스템, AI 캐릭터 텍스트 파싱, WebSocket Fallback 시스템 등 다양한 프론트엔드 프로젝트를 확인하세요.",
  keywords:
    "포트폴리오, 이종민, 프론트엔드 개발자, React, TypeScript, TradingView, AI, WebSocket, 프로젝트",
  image: "https://jongmany.github.io/my-blog/img/profile.jpeg",
  url: "https://jongmany.github.io/my-blog/portfolio/",
  type: "website" as const,
  author: "이종민",
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
  author,
}: SEOProps) {
  const seo = {
    title: title ? `${title} | 이종민 포트폴리오` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    type: type || defaultSEO.type,
    author: author || defaultSEO.author,
  };

  return (
    <Helmet>
      {/* 기본 메타데이터 */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />

      {/* Open Graph 메타데이터 */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card 메타데이터 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* 추가 SEO 메타데이터 */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={seo.url} />
    </Helmet>
  );
}
