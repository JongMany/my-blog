// scripts/collect-ghp.js
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const out = path.join(root, "dist_ghp");
const REPO = "my-blog";

function cpDir(from, to, { skipIndex = false } = {}) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    if (skipIndex && f === "index.html") continue; // ⬅️ 리모트 index.html 생략
    const s = path.join(from, f);
    const d = path.join(to, f);
    const st = fs.statSync(s);
    st.isDirectory() ? cpDir(s, d, { skipIndex }) : fs.copyFileSync(s, d);
  }
}

function ensure404(dir) {
  const idx = path.join(dir, "index.html");
  const nf = path.join(dir, "404.html");
  if (fs.existsSync(idx)) fs.copyFileSync(idx, nf);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);

// 1) Shell → / (Pages의 /my-blog/에 해당)
const shellDist = path.join(root, "apps/shell/dist");
if (fs.existsSync(shellDist)) {
  cpDir(shellDist, out, { skipIndex: false });
  ensure404(out); // 루트에 404.html = index.html (혹은 2번 단계의 전역 404로 대체)
} else {
  console.warn("⚠️  apps/shell/dist not found, skipping shell build");
}

// 2) Remotes → /blog, /portfolio, /resume (index.html 제외)
const blogDist = path.join(root, "apps/blog/dist");
if (fs.existsSync(blogDist)) {
  cpDir(blogDist, path.join(out, "blog"), { skipIndex: true });
}
const pfDist = path.join(root, "apps/portfolio/dist");
if (fs.existsSync(pfDist)) {
  cpDir(pfDist, path.join(out, "portfolio"), { skipIndex: true });
}
const resumeDist = path.join(root, "apps/resume/dist");
if (fs.existsSync(resumeDist)) {
  cpDir(resumeDist, path.join(out, "resume"), { skipIndex: true });
}

// Jekyll 비활성화
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("✓ collected: Shell index만 루트, remotes는 index.html 제외");

// 루트 404.html: 어떤 경로든 Shell로 위임
const redirect404 = `<!doctype html><meta charset="utf-8">
<script>
  // /my-blog로 시작하는 현재 경로를 Shell에 넘긴다
  var base="/${REPO}";
  var path=location.pathname.startsWith(base)?location.pathname.slice(base.length):location.pathname;
  var to = path + location.search + location.hash;
  location.replace(base + "/?to=" + encodeURIComponent(to || "/"));
</script>`;
fs.writeFileSync(path.join(out, "404.html"), redirect404);
