/**
 * 내 나이를 계산하는 함수
 * 생년월일을 기준으로 현재 나이를 반환합니다.
 */
export function calculateMyAge(): number {
  // 생년월일 (예: 1990년 1월 1일)
  // TODO: 실제 생년월일로 변경하세요
  const birthDate = new Date(1990, 0, 1); // 월은 0부터 시작 (0 = 1월)
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // 생일이 아직 지나지 않았으면 나이에서 1을 빼기
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

