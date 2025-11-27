/* ───────────── 유틸리티 함수들 ───────────── */

/** 해시 함수 (36진수) */
export function hash36(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/** 안정적인 키 생성 함수 */
export function keyFor(path: number[], text: string) {
  return `${path.join(".")}:${hash36(text.trim())}`;
}
