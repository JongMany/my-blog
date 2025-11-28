import React from "react";
import type { BulletListProps } from "../types";
import { BulletItem } from "./bullet-item";
import { getListStyles } from "../lib/list-styles";
import { ARIA_LABELS, MAX_NESTING_LEVEL } from "../constants";
import { defaultKeyGenerator } from "../lib/key-generator";

/**
 * 재귀적으로 렌더링되는 불릿 리스트 컴포넌트
 *
 * @description
 * - 레벨별로 다른 스타일 적용 (disc, circle, square)
 * - 중첩된 구조를 재귀적으로 렌더링
 * - 의존성 주입을 통해 외부 의존성 제거
 */
export function BulletList({
  items,
  level,
  prefix,
  keywordImageMap,
  keyGenerator = defaultKeyGenerator,
  RichText,
  LinkGroup,
}: BulletListProps) {
  // 최대 중첩 레벨 체크
  if (level > MAX_NESTING_LEVEL) {
    console.warn(
      `BulletList: 최대 중첩 레벨(${MAX_NESTING_LEVEL})을 초과했습니다.`,
    );
    return null;
  }

  return (
    <ul
      className={getListStyles(level)}
      role="list"
      aria-label={level === 0 ? ARIA_LABELS.BULLET_LIST : undefined}
    >
      {items.map((item, index) => {
        // 고유한 키 생성: 부모 경로 + 현재 인덱스 + 텍스트 내용
        const key = keyGenerator([...prefix, index], item.text);
        // 하위 컴포넌트에 전달할 새로운 경로
        const newPrefix = [...prefix, index];

        return (
          <li key={key} role="listitem" aria-label={ARIA_LABELS.BULLET_ITEM}>
            <BulletItem
              item={item}
              level={level}
              prefix={newPrefix}
              keywordImageMap={keywordImageMap}
              keyGenerator={keyGenerator}
              RichText={RichText}
              LinkGroup={LinkGroup}
              BulletList={BulletList}
            />
          </li>
        );
      })}
    </ul>
  );
}
