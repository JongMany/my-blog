interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  siteName?: string;
  Helmet?: any; // react-helmet-async의 Helmet 컴포넌트를 props로 받음
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
  Helmet,
}: SEOProps) {
  const seo = {
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

  if (!Helmet) {
    return null; // Helmet이 제공되지 않으면 아무것도 렌더링하지 않음
  }

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
      <meta property="og:site_name" content={seo.siteName} />
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
