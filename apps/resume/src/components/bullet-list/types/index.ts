import type React from "react";
import type { PortfolioLink } from "@/service";

/**
 * 불릿 아이템 데이터 타입
 */
export interface Bullet {
  text: string;
  description?: string;
  tags?: string[];
  children?: Bullet[];
  portfolioLinks?: Array<PortfolioLink>;
}

/**
 * 키 생성 함수 타입
 */
export type KeyGenerator = (path: number[], text: string) => string;

/**
 * 리치 텍스트 컴포넌트 타입
 */
export interface RichTextComponentProps {
  text: string;
  keywordImageMap?: Record<string, string>;
}

export type RichTextComponent = React.ComponentType<RichTextComponentProps>;

/**
 * 링크 그룹 컴포넌트 타입
 */
export interface LinkGroupComponentProps {
  links: Array<PortfolioLink>;
}

export type LinkGroupComponent = React.ComponentType<LinkGroupComponentProps>;

/**
 * 불릿 리스트 Props 타입
 */
export interface BulletListProps {
  /** 렌더링할 불릿 아이템들 */
  items: Bullet[];
  /** 현재 중첩 레벨 (0부터 시작) */
  level: number;
  /** 부모 경로를 나타내는 인덱스 배열 (고유 키 생성용) */
  prefix: number[];
  /** 키워드 이미지 매핑 (툴팁용) */
  keywordImageMap?: Record<string, string>;
  /** 키 생성 함수 (의존성 주입) */
  keyGenerator?: KeyGenerator;
  /** 리치 텍스트 컴포넌트 (의존성 주입) */
  RichText?: RichTextComponent;
  /** 링크 그룹 컴포넌트 (의존성 주입) */
  LinkGroup?: LinkGroupComponent;
}

/**
 * 불릿 리스트 컴포넌트 타입 (순환 참조 제거용)
 */
export type BulletListComponent = React.ComponentType<BulletListProps>;
