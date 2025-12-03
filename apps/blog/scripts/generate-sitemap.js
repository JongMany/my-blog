/**
 * Sitemap 자동 생성 스크립트
 * 빌드 시 MDX 파일들을 읽어서 sitemap.xml을 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://jongmany.github.io/my-blog/blog';
const CONTENTS_DIR = path.join(__dirname, '../src/contents');
const OUTPUT_DIR = path.join(__dirname, '../public');

// 카테고리별 URL 매핑
const CATEGORY_URL_MAP = {
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
function findMdxFiles(dir, category) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath, category));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const frontmatter = parseFrontmatter(content);

      // published가 명시적으로 false인 경우 제외
      if (frontmatter.published === false) continue;

      const slug = path.basename(entry.name, path.extname(entry.name));
      const updatedAt = frontmatter.updatedAt || frontmatter.createdAt || frontmatter.date;

      files.push({
        slug,
        category,
        title: frontmatter.title || slug,
        updatedAt,
        priority: category === 'posts' ? '0.8' : '0.6',
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

  // 정적 페이지들
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/posts', priority: '0.9', changefreq: 'daily' },
    { url: '/books', priority: '0.7', changefreq: 'weekly' },
    { url: '/retrospect', priority: '0.7', changefreq: 'weekly' },
    { url: '/logs', priority: '0.7', changefreq: 'weekly' },
    { url: '/economy', priority: '0.6', changefreq: 'weekly' },
  ];

  // 정적 페이지 추가
  for (const page of staticPages) {
    pages.push({
      loc: `${BASE_URL}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // 동적 콘텐츠 페이지들
  for (const [dirName, urlPath] of Object.entries(CATEGORY_URL_MAP)) {
    const categoryDir = path.join(CONTENTS_DIR, dirName);
    const files = findMdxFiles(categoryDir, urlPath);

    for (const file of files) {
      pages.push({
        loc: `${BASE_URL}/${file.category}/${file.slug}`,
        lastmod: file.updatedAt || new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: file.priority,
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
  const outputPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`   Total URLs: ${pages.length}`);

  return pages.length;
}

// 실행
generateSitemap();

