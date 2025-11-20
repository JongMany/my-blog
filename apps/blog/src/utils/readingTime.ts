/**
 * 읽기 시간 계산 유틸리티
 *
 * 한국어와 영어를 모두 고려하여 읽기 시간을 계산합니다.
 * - 한국어: 분당 약 300자
 * - 영어: 분당 약 200단어
 */

const WORDS_PER_MINUTE_KO = 300; // 한국어 분당 읽는 글자 수
const WORDS_PER_MINUTE_EN = 200; // 영어 분당 읽는 단어 수

/**
 * 텍스트에서 한국어와 영어를 구분하여 읽기 시간을 계산합니다.
 *
 * @param text 읽을 텍스트
 * @returns 읽기 시간 (분, 최소 1분)
 */
export function calculateReadingTime(text: string): number {
  if (!text || text.trim().length === 0) {
    return 1;
  }

  // 마크다운 문법 제거 (간단한 정규식)
  const plainText = text
    .replace(/```[\s\S]*?```/g, "") // 코드 블록
    .replace(/`[^`]+`/g, "") // 인라인 코드
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // 링크
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // 이미지
    .replace(/[#*_~`]/g, "") // 마크다운 강조
    .replace(/\n+/g, " ") // 줄바꿈을 공백으로
    .trim();

  // 한국어 글자 수 계산 (한글, 한자 포함)
  const koreanChars = (plainText.match(/[가-힣一-龯]/g) || []).length;

  // 영어 단어 수 계산 (영어 알파벳으로 구성된 단어)
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;

  // 읽기 시간 계산
  const koreanTime = koreanChars / WORDS_PER_MINUTE_KO;
  const englishTime = englishWords / WORDS_PER_MINUTE_EN;
  const totalTime = koreanTime + englishTime;

  // 최소 1분 반환
  return Math.max(1, Math.ceil(totalTime));
}

