/**
 * 소수점이 포함된 숫자 입력값을 정리(sanitize)
 *
 * @param value 입력된 문자열
 * @returns
 *  - 숫자와 소수점(.)만 포함된 문자열을 반환합니다.
 *  - 소수점은 가장 첫 번째 등장한 것만 허용하며, 이후 중복된 소수점은 제거됩니다.
 *  - 입력이 '.'로 시작하면 '0.'로 변환됩니다.
 *  - 정수 부분의 불필요한 선행 0은 제거되며, 단 숫자 0은 유지됩니다.
 *
 * 예시)
 *  '00012.340.56abc' → '12.34056'
 *  '.'               → '0.'
 *  'abc'             → ''
 *
 * 참고)
 * 정리된 정책이 따로 없는 것 같아 임시로 만들었습니다.
 * 혹시나 필요하시면 자유롭게 추가/수정하셔도 됩니다.
 * 현재 사용중인 곳: 지갑 - 이체/전환 모달
 */
export const onlyDecimalNumber = (value: string) => {
  // 1. 숫자와 소수점(.)만 남기기, 소수점은 첫번째만 허용
  let cleaned = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  // 2. 만약 값이 '.'로 시작하면 '0.'로 변경
  if (cleaned === ".") {
    return "0.";
  }

  // 3. 소수점 기준으로 앞부분과 뒷부분 분리
  const [integerPart, decimalPart] = cleaned.split(".");

  // 4. 앞부분의 0 여러 개 -> 한 개만 남기기, 단 '0' 아니면 앞의 0 제거
  // 예: "00000" -> "0", "000123" -> "123"
  let newIntegerPart = integerPart.replace(/^0+(?=\d)/, "");

  return decimalPart !== undefined
    ? `${newIntegerPart}.${decimalPart}`
    : newIntegerPart;
};
