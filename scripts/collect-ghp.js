// scripts/collect-ghp.js (배포용)
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const out = path.join(root, "dist_ghp");

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

// ✅ shell → /  (== Pages의 /my-blog/ 에 해당)
const shellDist = path.join(root, "apps/shell/dist");
if (!fs.existsSync(shellDist)) {
  console.error("❌ apps/shell/dist 가 없습니다. 먼저 빌드 확인.");
  process.exit(1);
}
cpDir(shellDist, out);
ensure404(out);

// ✅ blog → /blog
const blogDist = path.join(root, "apps/blog/dist");
if (fs.existsSync(blogDist)) {
  const blogOut = path.join(out, "blog");
  cpDir(blogDist, blogOut);
  ensure404(blogOut);
}

// ✅ portfolio → /portfolio
const portfolioDist = path.join(root, "apps/portfolio/dist");
if (fs.existsSync(portfolioDist)) {
  const pfOut = path.join(out, "portfolio");
  cpDir(portfolioDist, pfOut);
  ensure404(pfOut);
}

// ✅ resume → /resume
const resumeDist = path.join(root, "apps/resume/dist");
if (fs.existsSync(resumeDist)) {
  const resumeOut = path.join(out, "resume");
  cpDir(resumeDist, resumeOut);
  ensure404(resumeOut);
}

// ✅ Jekyll 비활성화
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("✓ collected to dist_ghp/ (Pages site root = /my-blog/)");
