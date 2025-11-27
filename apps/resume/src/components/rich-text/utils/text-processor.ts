/**
 * 텍스트 처리 관련 순수함수들
 *
 * 대괄호로 감싼 키워드([keyword])를 찾아서
 * keywordImageMap에 해당 키워드의 이미지가 있으면 툴팁으로,
 * 없으면 일반 텍스트로 변환합니다.
 */

/**
 * 텍스트의 한 부분을 나타내는 타입
 */
export interface TextPart {
  /** 고유 식별자 (렌더링 시 key로 사용) */
  id: string;
  /** 텍스트 타입: 일반 텍스트 또는 툴팁 */
  type: "text" | "tooltip";
  /** 실제 표시될 텍스트 내용 */
  content: string;
  /** 툴팁인 경우 키워드 (keywordImageMap에서 이미지를 찾을 때 사용) */
  keyword?: string;
}

/**
 * 대괄호로 감싼 키워드의 위치 정보
 */
interface BracketMatch {
  /** 대괄호 내부의 키워드 */
  keyword: string;
  /** 대괄호 시작 위치 (인덱스) */
  startIndex: number;
  /** 대괄호 종료 위치 (인덱스) */
  endIndex: number;
}

/**
 * 텍스트에서 대괄호 패턴을 찾아 위치 정보와 함께 반환
 *
 * @example
 * findBracketMatches("안녕 [React] 세계")
 * // [{ keyword: "React", startIndex: 3, endIndex: 10 }]
 */
function findBracketMatches(text: string): BracketMatch[] {
  // 대괄호로 감싼 텍스트를 찾는 정규식
  // [^\]]+ : ]가 아닌 문자 하나 이상 (대괄호 내부 내용)
  const bracketPattern = /\[([^\]]+)\]/g;

  return Array.from(text.matchAll(bracketPattern), (match) => ({
    keyword: match[1], // 첫 번째 캡처 그룹 (대괄호 내부)
    startIndex: match.index!, // 대괄호 시작 위치
    endIndex: match.index! + match[0].length, // 대괄호 종료 위치
  }));
}

/**
 * TextPart 객체를 생성하는 헬퍼 함수
 *
 * @param id - 파트의 순서 번호
 * @param type - 텍스트 타입
 * @param content - 표시될 내용
 * @param keyword - 툴팁인 경우 키워드 (optional)
 */
function createTextPart(
  id: number,
  type: "text" | "tooltip",
  content: string,
  keyword?: string,
): TextPart {
  return {
    id: `${type}-${id}`,
    type,
    content,
    // keyword가 있을 때만 객체에 포함 (spread 연산자로 조건부 추가)
    ...(keyword && { keyword }),
  };
}

/**
 * 텍스트를 TextPart 배열로 변환
 *
 * 처리 과정:
 * 1. 대괄호로 감싼 키워드를 모두 찾음
 * 2. 각 키워드의 앞뒤 텍스트를 분리
 * 3. keywordImageMap에 이미지가 있으면 tooltip, 없으면 text로 처리
 *
 * @example
 * processRichText("안녕 [React] 세계", { React: "/img/react.png" })
 * // [
 * //   { id: "text-0", type: "text", content: "안녕 " },
 * //   { id: "tooltip-1", type: "tooltip", content: "React", keyword: "React" },
 * //   { id: "text-2", type: "text", content: " 세계" }
 * // ]
 */
export function processRichText(
  text: string,
  keywordImageMap?: Record<string, string>,
): TextPart[] {
  const bracketMatches = findBracketMatches(text);
  const parts: TextPart[] = [];
  let lastIndex = 0; // 마지막으로 처리한 텍스트의 끝 위치
  let partId = 0; // TextPart의 고유 ID 생성용 카운터

  // 대괄호가 없는 경우 전체 텍스트를 하나의 TextPart로 반환
  if (bracketMatches.length === 0) {
    return [createTextPart(partId, "text", text)];
  }

  bracketMatches.forEach((match) => {
    // 대괄호 이전의 일반 텍스트 추가
    // (이전 대괄호의 끝 위치와 현재 대괄호의 시작 위치 사이)
    if (match.startIndex > lastIndex) {
      const textContent = text.slice(lastIndex, match.startIndex);
      // 빈 문자열이 아닌 경우에만 추가
      if (textContent) {
        parts.push(createTextPart(partId++, "text", textContent));
      }
    }

    // 대괄호 내부 키워드 처리
    // keywordImageMap에 해당 키워드의 이미지가 있으면 툴팁으로, 없으면 일반 텍스트로
    const hasImage = Boolean(keywordImageMap?.[match.keyword]);
    parts.push(
      createTextPart(
        partId++,
        hasImage ? "tooltip" : "text",
        match.keyword,
        hasImage ? match.keyword : undefined,
      ),
    );

    // 다음 반복을 위해 마지막 처리 위치 업데이트
    lastIndex = match.endIndex;
  });

  // 마지막 대괄호 이후의 남은 텍스트 추가
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      parts.push(createTextPart(partId++, "text", remainingText));
    }
  }

  return parts;
}
