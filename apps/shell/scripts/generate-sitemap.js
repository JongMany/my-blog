/**
 * Sitemap 자동 생성 스크립트
 * 모든 MFE 앱의 페이지를 포함하는 sitemap.xml을 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://jongmany.github.io/my-blog';
const OUTPUT_DIR = path.join(__dirname, '../public');

// 블로그 콘텐츠 디렉토리
const BLOG_CONTENTS_DIR = path.join(__dirname, '../../blog/src/contents');

// 포트폴리오 콘텐츠 디렉토리
const PORTFOLIO_CONTENTS_DIR = path.join(__dirname, '../../portfolio/src/contents');

// 블로그 카테고리별 URL 매핑
const BLOG_CATEGORIES = {
  posts: 'posts',
  books: 'books',
  retrospect: 'retrospect',
  logs: 'logs',
  economy: 'economy',
};

/**
 * Frontmatter를 파싱합니다.
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatterStr = frontmatterMatch[1];
  const result = {};

  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let isArray = false;

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();

      if (value === '') {
        result[currentKey] = [];
        isArray = true;
      } else if (value === 'true') {
        result[currentKey] = true;
        isArray = false;
      } else if (value === 'false') {
        result[currentKey] = false;
        isArray = false;
      } else {
        result[currentKey] = value;
        isArray = false;
      }
    } else if (isArray && line.trim().startsWith('- ')) {
      result[currentKey].push(line.trim().slice(2));
    }
  }

  return result;
}

/**
 * 디렉토리 내 모든 MDX 파일을 재귀적으로 찾습니다.
 */
function findMdxFiles(dir, basePath) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath, basePath));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const frontmatter = parseFrontmatter(content);

      // published가 명시적으로 false인 경우 제외
      // published가 없거나 true인 경우 포함 (기본값: true)
      if (frontmatter.published === false) {
        console.log(`   ⏭️  건너뜀 (published: false): ${entry.name}`);
        continue;
      }

      const slug = path.basename(entry.name, path.extname(entry.name));
      const updatedAt = frontmatter.updatedAt || frontmatter.createdAt || frontmatter.date;

      files.push({
        slug,
        title: frontmatter.title || slug,
        updatedAt,
      });
    }
  }

  return files;
}

/**
 * Sitemap XML을 생성합니다.
 */
function generateSitemap() {
  const pages = [];
  const today = new Date().toISOString().split('T')[0];

  // === 정적 페이지들 ===
  
  // 메인 (Home)
  pages.push({
    loc: BASE_URL,
    lastmod: today,
    changefreq: 'weekly',
    priority: '1.0',
  });

  // 블로그 메인 및 카테고리 페이지
  pages.push({
    loc: `${BASE_URL}/blog`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
  });

  for (const category of Object.values(BLOG_CATEGORIES)) {
    pages.push({
      loc: `${BASE_URL}/blog/${category}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.8',
    });
  }

  // 포트폴리오
  pages.push({
    loc: `${BASE_URL}/portfolio`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9',
  });

  // 이력서
  pages.push({
    loc: `${BASE_URL}/resume`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.8',
  });

  // === 블로그 동적 콘텐츠 ===
  for (const [dirName, urlPath] of Object.entries(BLOG_CATEGORIES)) {
    const categoryDir = path.join(BLOG_CONTENTS_DIR, dirName);
    
    if (!fs.existsSync(categoryDir)) {
      console.warn(`⚠️  카테고리 디렉토리가 없습니다: ${categoryDir}`);
      continue;
    }
    
    const files = findMdxFiles(categoryDir);
    console.log(`📁 ${dirName}: ${files.length}개 파일 발견`);

    for (const file of files) {
      // 날짜 포맷팅 (YYYY-MM-DD 형식으로 정규화)
      let lastmod = file.updatedAt || today;
      if (lastmod && lastmod.length > 10) {
        lastmod = lastmod.substring(0, 10);
      }
      
      pages.push({
        loc: `${BASE_URL}/blog/${urlPath}/${file.slug}`,
        lastmod: lastmod || today,
        changefreq: 'monthly',
        priority: '0.7',
      });
    }
  }

  // === 포트폴리오 동적 콘텐츠 ===
  if (fs.existsSync(PORTFOLIO_CONTENTS_DIR)) {
    const portfolioFiles = findMdxFiles(PORTFOLIO_CONTENTS_DIR);
    for (const file of portfolioFiles) {
      pages.push({
        loc: `${BASE_URL}/portfolio/${file.slug}`,
        lastmod: file.updatedAt || today,
        changefreq: 'monthly',
        priority: '0.7',
      });
    }
  }

  // XML 생성
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  // 파일 저장
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const outputPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  // 카테고리별 통계 출력
  const categoryStats = {};
  for (const page of pages) {
    const match = page.loc.match(/\/blog\/([^\/]+)/);
    if (match) {
      const category = match[1];
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    }
  }
  
  console.log(`\n📊 카테고리별 통계:`);
  for (const [category, count] of Object.entries(categoryStats)) {
    console.log(`   ${category}: ${count}개`);
  }
  
  console.log(`\n✅ Sitemap generated: ${outputPath}`);
  console.log(`   Total URLs: ${pages.length}`);

  return pages.length;
}

// 실행
generateSitemap();

