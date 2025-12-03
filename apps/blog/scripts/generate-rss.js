/**
 * RSS Feed 자동 생성 스크립트
 * 빌드 시 MDX 파일들을 읽어서 RSS 피드를 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jongmany.github.io/my-blog/blog';
const SITE_TITLE = '이종민 블로그';
const SITE_DESCRIPTION = '프론트엔드 개발 경험, React, TypeScript, TradingView 개발 노하우, AI 채팅 플랫폼 개발 과정을 공유합니다.';
const AUTHOR_NAME = '이종민';

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
      const date = frontmatter.createdAt || frontmatter.date || new Date().toISOString().split('T')[0];

      files.push({
        slug,
        category,
        title: frontmatter.title || slug,
        summary: frontmatter.summary || '',
        date,
        tags: frontmatter.tags || [],
      });
    }
  }

  return files;
}

/**
 * XML 특수문자를 이스케이프합니다.
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * RSS Feed XML을 생성합니다.
 */
function generateRssFeed() {
  const allPosts = [];

  // 모든 카테고리의 콘텐츠 수집
  for (const [dirName, urlPath] of Object.entries(CATEGORY_URL_MAP)) {
    const categoryDir = path.join(CONTENTS_DIR, dirName);
    const files = findMdxFiles(categoryDir, urlPath);
    allPosts.push(...files);
  }

  // 날짜순 정렬 (최신순)
  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 최근 20개만 포함
  const recentPosts = allPosts.slice(0, 20);

  const buildDate = new Date().toUTCString();
  const lastBuildDate = recentPosts.length > 0 
    ? new Date(recentPosts[0].date).toUTCString() 
    : buildDate;

  // RSS XML 생성
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <managingEditor>${AUTHOR_NAME}</managingEditor>
    <webMaster>${AUTHOR_NAME}</webMaster>
    <generator>Custom RSS Generator</generator>
    <ttl>60</ttl>
${recentPosts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/${post.category}/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${post.category}/${post.slug}</guid>
      <description>${escapeXml(post.summary || post.title)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>${AUTHOR_NAME}</dc:creator>
      ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  // 파일 저장
  const outputPath = path.join(OUTPUT_DIR, 'rss.xml');
  fs.writeFileSync(outputPath, rss, 'utf-8');

  // Atom Feed도 생성
  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}" rel="alternate"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${AUTHOR_NAME}</name>
  </author>
${recentPosts
  .map(
    (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/${post.category}/${post.slug}"/>
    <id>${SITE_URL}/${post.category}/${post.slug}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary>${escapeXml(post.summary || post.title)}</summary>
    <author>
      <name>${AUTHOR_NAME}</name>
    </author>
    ${post.tags.map(tag => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
  </entry>`
  )
  .join('\n')}
</feed>`;

  const atomOutputPath = path.join(OUTPUT_DIR, 'atom.xml');
  fs.writeFileSync(atomOutputPath, atom, 'utf-8');

  console.log(`✅ RSS Feed generated: ${outputPath}`);
  console.log(`✅ Atom Feed generated: ${atomOutputPath}`);
  console.log(`   Total posts: ${recentPosts.length}`);

  return recentPosts.length;
}

// 실행
generateRssFeed();

