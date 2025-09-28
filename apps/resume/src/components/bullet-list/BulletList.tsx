import React from "react";
import { keyFor } from "../../utils/resumeUtils";
import { BulletItem } from "./BulletItem";
import { getListStyles } from "./utils";
import {
  ARIA_LABELS,
  MAX_NESTING_LEVEL,
} from "./constants/bulletListConstants";
import { PortfolioLink } from "../../service";

export interface Bullet {
  text: string;
  description?: string;
  tags?: string[];
  children?: Bullet[];
  portfolioLinks?: Array<PortfolioLink>;
}

interface BulletListProps {
  /** 렌더링할 불릿 아이템들 */
  items: Bullet[];
  /** 현재 중첩 레벨 (0부터 시작) */
  level: number;
  /** 부모 경로를 나타내는 인덱스 배열 (고유 키 생성용) */
  prefix: number[];
  /** 키워드 이미지 매핑 (툴팁용) */
  keywordImageMap?: Record<string, string>;
}

/**
 * 재귀적으로 렌더링되는 불릿 리스트 컴포넌트
 *
 * @description
 * - 레벨별로 다른 스타일 적용 (disc, circle, square)
 * - 중첩된 구조를 재귀적으로 렌더링
 */
export function BulletList({
  items,
  level,
  prefix,
  keywordImageMap,
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
        const key = keyFor([...prefix, index], item.text);
        // 하위 컴포넌트에 전달할 새로운 경로
        const newPrefix = [...prefix, index];

        return (
          <li key={key} role="listitem" aria-label={ARIA_LABELS.BULLET_ITEM}>
            <BulletItem
              item={item}
              level={level}
              prefix={newPrefix}
              keywordImageMap={keywordImageMap}
            />
          </li>
        );
      })}
    </ul>
  );
}
