import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import iconv from "iconv-lite";
import chardet from "chardet";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "apps/blog/content/blog");

function listStaged() {
  const out = execSync("git diff --cached --name-only --diff-filter=ACM", {
    stdio: ["ignore", "pipe", "ignore"],
  }).toString();
  return out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(
      (f) =>
        (f.endsWith(".md") || f.endsWith(".mdx")) &&
        f.startsWith("apps/blog/content/blog/")
    );
}

function looksBrokenUTF8(txt) {
  // U+FFFD(�)가 있으면 깨졌다고 판단
  return txt.includes("\uFFFD");
}

function toUtf8(abs) {
  const buf = fs.readFileSync(abs);
  // 1) 우선 UTF-8로 시도
  let txt = buf.toString("utf8");
  if (!looksBrokenUTF8(txt)) return { changed: false };

  // 2) 감지 후 재디코딩 (주요 케이스: EUC-KR/CP949)
  const guess = (chardet.detect(buf) || "").toString().toUpperCase();
  const tryList = [];
  if (guess) tryList.push(guess);
  tryList.push("CP949", "EUC-KR", "WINDOWS-1252"); // 백업 후보

  for (const enc of tryList) {
    try {
      const decoded = iconv.decode(buf, enc);
      if (!looksBrokenUTF8(decoded)) {
        fs.writeFileSync(abs, decoded, { encoding: "utf8" }); // UTF-8로 저장
        return { changed: true, from: enc };
      }
    } catch {}
  }
  // 실패해도 최소 UTF-8로 덮어쓰기 않음(원본 보존)
  return { changed: false, failed: true, guess };
}

const files = listStaged();
if (!files.length) {
  console.log("[utf8] no md/mdx staged under apps/blog/content/blog");
  process.exit(0);
}

let converted = 0;
for (const rel of files) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const { changed, from, failed, guess } = toUtf8(abs);
  if (failed) {
    console.warn(
      `[utf8] WARN: ${rel} 인코딩 변환 실패 (guess=${guess || "unknown"})`
    );
    continue;
  }
  if (changed) {
    converted++;
    console.log(`[utf8] converted -> ${rel} (from ${from})`);
  }
}
console.log(`[utf8] done, converted ${converted}/${files.length}`);
