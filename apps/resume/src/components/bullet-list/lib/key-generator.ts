import type { KeyGenerator } from "../types";

/**
 * 기본 키 생성 함수
 * 
 * @param path - 부모 경로를 나타내는 인덱스 배열
 * @param text - 텍스트 내용
 * @returns 고유한 키 문자열
 */
function hash36(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export const defaultKeyGenerator: KeyGenerator = (path, text) => {
  return `${path.join(".")}:${hash36(text.trim())}`;
};

