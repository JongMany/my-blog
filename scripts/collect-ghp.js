// scripts/collect-ghp.js
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const out = path.join(root, "dist_ghp");
const REPO = "my-blog";

function cpDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const s = path.join(from, f);
    const d = path.join(to, f);
    const st = fs.statSync(s);
    st.isDirectory() ? cpDir(s, d) : fs.copyFileSync(s, d);
  }
}

function ensure404(dir) {
  const idx = path.join(dir, "index.html");
  const nf = path.join(dir, "404.html");
  if (fs.existsSync(idx)) fs.copyFileSync(idx, nf);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);

// ✅ shell → /my-blog/
const siteRoot = path.join(out, REPO);
const shellDist = path.join(root, "apps/shell/dist");
if (!fs.existsSync(shellDist)) {
  console.error("❌ apps/shell/dist 가 없습니다. 먼저 빌드 확인.");
  process.exit(1);
}
cpDir(shellDist, siteRoot);
ensure404(siteRoot);

// ✅ blog → /my-blog/blog
const blogDist = path.join(root, "apps/blog/dist");
if (fs.existsSync(blogDist)) {
  const blogOut = path.join(siteRoot, "blog");
  cpDir(blogDist, blogOut);
  ensure404(blogOut);
}

// ✅ portfolio → /my-blog/portfolio
const portfolioDist = path.join(root, "apps/portfolio/dist");
if (fs.existsSync(portfolioDist)) {
  const pfOut = path.join(siteRoot, "portfolio");
  cpDir(portfolioDist, pfOut);
  ensure404(pfOut);
}

// ✅ resume → /my-blog/resume
const resumeDist = path.join(root, "apps/resume/dist");
if (fs.existsSync(resumeDist)) {
  const resumeOut = path.join(siteRoot, "resume");
  cpDir(resumeDist, resumeOut);
  ensure404(resumeOut);
}

// ✅ 루트 / → /my-blog/ 리다이렉트
const redirectHtml = `<!doctype html><meta http-equiv="refresh" content="0; url=/${REPO}/"><script>location.replace('/${REPO}/')</script>`;
fs.writeFileSync(path.join(out, "index.html"), redirectHtml);

console.log("✓ collected to dist_ghp/my-blog/ (root redirects to /my-blog/)");
