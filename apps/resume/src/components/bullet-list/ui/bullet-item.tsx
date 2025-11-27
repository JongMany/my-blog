import React from "react";
import type {
  Bullet,
  KeyGenerator,
  EmphasisComponent,
  PortfolioLinksComponent,
  BulletListComponent,
} from "../types";
import { BulletTag } from "./bullet-tag";
import { ARIA_LABELS } from "../constants";

interface BulletItemProps {
  /** 렌더링할 불릿 아이템 데이터 */
  item: Bullet;
  /** 현재 중첩 레벨 */
  level: number;
  /** 부모 경로를 나타내는 인덱스 배열 */
  prefix: number[];
  /** 키워드 이미지 매핑 (툴팁용) */
  keywordImageMap?: Record<string, string>;
  /** 키 생성 함수 (의존성 주입) */
  keyGenerator: KeyGenerator;
  /** 텍스트 강조 컴포넌트 (의존성 주입) */
  Emphasis?: EmphasisComponent;
  /** 포트폴리오 링크 컴포넌트 (의존성 주입) */
  PortfolioLinks?: PortfolioLinksComponent;
  /** 불릿 리스트 컴포넌트 (의존성 주입 - 순환 참조 제거) */
  BulletList: BulletListComponent;
}

/**
 * 개별 불릿 아이템을 렌더링하는 컴포넌트
 *
 * @description
 * - 텍스트 강조, 태그, 하위 불릿, 포트폴리오 링크를 포함
 * - 재귀적으로 하위 불릿 리스트를 렌더링
 * - 조건부 렌더링으로 불필요한 DOM 요소 생성 방지
 * - 의존성 주입을 통해 외부 의존성 제거
 */
export const BulletItem = React.memo(function BulletItem({
  item,
  level,
  prefix,
  keywordImageMap,
  keyGenerator,
  Emphasis,
  PortfolioLinks,
  BulletList,
}: BulletItemProps) {
  // 태그와 하위 컴포넌트에서 사용할 고유 키 접두사
  const keyPrefix = prefix.join("-");

  // depth에 따른 텍스트 크기 결정
  const textSizeClass = level >= 2 ? "text-[11px]" : "text-[12px]";

  return (
    <>
      {/* 메인 텍스트와 태그 영역 */}
      <div className={`${textSizeClass}`}>
        {Emphasis ? (
          <Emphasis text={item.text} keywordImageMap={keywordImageMap} />
        ) : (
          item.text
        )}
        {item.tags?.length ? (
          <span
            className="ml-2 inline-flex flex-wrap gap-1 align-middle"
            aria-label={ARIA_LABELS.TAG}
          >
            {item.tags.map((tag) => (
              <BulletTag
                key={`${keyPrefix}:tag:${tag}`}
                tag={tag}
                keyPrefix={keyPrefix}
                level={level}
              />
            ))}
          </span>
        ) : null}
      </div>

      {/* Description 영역 */}
      {item.description ? (
        <div
          className={`mt-1.5 ${level >= 2 ? "text-[10px]" : "text-[11px]"} text-[var(--muted-fg)] leading-relaxed whitespace-pre-line`}
        >
          {Emphasis ? (
            <Emphasis
              text={item.description}
              keywordImageMap={keywordImageMap}
            />
          ) : (
            item.description
          )}
        </div>
      ) : null}

      {/* 하위 불릿 리스트 (재귀 렌더링) */}
      {item.children?.length ? (
        <div className="mt-1.5">
          <BulletList
            items={item.children}
            level={level + 1}
            prefix={prefix}
            keywordImageMap={keywordImageMap}
            keyGenerator={keyGenerator}
            Emphasis={Emphasis}
            PortfolioLinks={PortfolioLinks}
          />
        </div>
      ) : null}

      {/* 포트폴리오 링크들 */}
      {item.portfolioLinks?.length && PortfolioLinks ? (
        <div aria-label={ARIA_LABELS.PORTFOLIO_LINKS}>
          <PortfolioLinks links={item.portfolioLinks} />
        </div>
      ) : null}
    </>
  );
});
