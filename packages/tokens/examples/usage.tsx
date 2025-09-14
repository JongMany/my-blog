/**
 * Design Token Usage Examples
 * 개선된 토큰 시스템 사용법 가이드
 */

import React from "react";
import {
  tokens,
  theme,
  type SemanticColorToken,
  type BackgroundToken,
} from "@srf/tokens";

// ============================================================================
// 1. 기본 사용법 - CSS 변수 방식
// ============================================================================

const BasicUsageExample = () => {
  return (
    <div
      style={{
        // ✅ 새로운 방식: 명확한 의미의 토큰
        backgroundColor: "var(--color-background-canvas)",
        color: "var(--color-text-primary)",
        padding: "var(--spacing-component-lg)",
        borderRadius: "var(--radius-component-md)",
        border: "1px solid var(--color-border-default)",
      }}
    >
      <h2 style={{ color: "var(--color-accent-text)" }}>
        개선된 토큰 시스템! 🎉
      </h2>
      <p style={{ color: "var(--color-text-secondary)" }}>
        이제 Radix UI와 Adobe Spectrum 수준의 토큰 시스템을 사용할 수 있습니다.
      </p>
    </div>
  );
};

// ============================================================================
// 2. TypeScript + tokens 객체 사용법 (권장)
// ============================================================================

const TypeSafeExample = () => {
  return (
    <div
      style={{
        // ✅ 타입 안전 + 자동완성 지원
        backgroundColor: tokens.background.canvas,
        color: tokens.text.primary,
        padding: tokens.spacing.lg,
        borderRadius: tokens.radius.md,
      }}
    >
      <button
        style={{
          backgroundColor: tokens.accent.solid,
          color: tokens.text.primary, // 실제론 inverse를 써야 함
          border: "none",
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          borderRadius: tokens.radius.sm,
          cursor: "pointer",
        }}
      >
        Primary Button
      </button>

      <button
        style={{
          backgroundColor: tokens.background.surface,
          color: tokens.text.primary,
          border: `1px solid var(--color-border-default)`,
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          borderRadius: tokens.radius.sm,
          marginLeft: tokens.spacing.sm,
          cursor: "pointer",
        }}
      >
        Secondary Button
      </button>
    </div>
  );
};

// ============================================================================
// 3. 상태별 색상 사용법
// ============================================================================

const StatusColorsExample = () => {
  return (
    <div style={{ padding: tokens.spacing.lg }}>
      {/* 성공 메시지 */}
      <div
        style={{
          backgroundColor: "var(--color-success-subtle)",
          color: "var(--color-success-text)",
          padding: tokens.spacing.md,
          borderRadius: tokens.radius.sm,
          border: "1px solid var(--color-success-surface)",
          marginBottom: tokens.spacing.sm,
        }}
      >
        ✅ 성공: 작업이 완료되었습니다!
      </div>

      {/* 경고 메시지 */}
      <div
        style={{
          backgroundColor: "var(--color-warning-subtle)",
          color: "var(--color-warning-text)",
          padding: tokens.spacing.md,
          borderRadius: tokens.radius.sm,
          border: "1px solid var(--color-warning-surface)",
          marginBottom: tokens.spacing.sm,
        }}
      >
        ⚠️ 경고: 주의가 필요합니다.
      </div>

      {/* 에러 메시지 */}
      <div
        style={{
          backgroundColor: "var(--color-error-subtle)",
          color: "var(--color-error-text)",
          padding: tokens.spacing.md,
          borderRadius: tokens.radius.sm,
          border: "1px solid var(--color-error-surface)",
          marginBottom: tokens.spacing.sm,
        }}
      >
        ❌ 에러: 문제가 발생했습니다.
      </div>

      {/* 정보 메시지 */}
      <div
        style={{
          backgroundColor: "var(--color-info-subtle)",
          color: "var(--color-info-text)",
          padding: tokens.spacing.md,
          borderRadius: tokens.radius.sm,
          border: "1px solid var(--color-info-surface)",
        }}
      >
        ℹ️ 정보: 추가 정보를 확인하세요.
      </div>
    </div>
  );
};

// ============================================================================
// 4. 테마 토글 사용법
// ============================================================================

const ThemeToggleExample = () => {
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light",
  );

  const toggleTheme = () => {
    if (currentTheme === "light") {
      theme.setDark();
      setCurrentTheme("dark");
    } else {
      theme.setLight();
      setCurrentTheme("light");
    }
  };

  return (
    <div
      style={{
        backgroundColor: tokens.background.panel,
        color: tokens.text.primary,
        padding: tokens.spacing.lg,
        borderRadius: tokens.radius.md,
        border: "1px solid var(--color-border-default)",
      }}
    >
      <h3>테마 토글 예제</h3>
      <p>현재 테마: {currentTheme}</p>

      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: tokens.accent.solid,
          color: "white", // 실제론 tokens.text.inverse 사용
          border: "none",
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          borderRadius: tokens.radius.sm,
          cursor: "pointer",
        }}
      >
        {currentTheme === "light" ? "🌙 다크 모드" : "☀️ 라이트 모드"}
      </button>
    </div>
  );
};

// ============================================================================
// 5. CSS-in-JS와 함께 사용하기 (styled-components 등)
// ============================================================================

// styled-components 예제 (실제 사용 시)
const StyledComponentExample = `
import styled from 'styled-components';
import { tokens } from '@srf/tokens';

const Card = styled.div\`
  background-color: \${tokens.background.panel};
  color: \${tokens.text.primary};
  padding: \${tokens.spacing.lg};
  border-radius: \${tokens.radius.md};
  border: 1px solid var(--color-border-default);
  
  &:hover {
    background-color: var(--color-background-hover);
  }
\`;

const PrimaryButton = styled.button\`
  background-color: \${tokens.accent.solid};
  color: var(--color-text-inverse);
  border: none;
  padding: \${tokens.spacing.sm} \${tokens.spacing.md};
  border-radius: \${tokens.radius.sm};
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-accent-solid-hover);
  }
  
  &:disabled {
    background-color: var(--color-background-surface);
    color: var(--color-text-disabled);
    cursor: not-allowed;
  }
\`;
`;

// ============================================================================
// 6. 타입 안전한 토큰 유틸리티 함수
// ============================================================================

// 토큰 값 검증 함수
function validateToken(token: SemanticColorToken): boolean {
  return typeof token === "string" && token.startsWith("color-");
}

// 배경 토큰만 허용하는 함수
function setBackgroundToken(element: HTMLElement, token: BackgroundToken) {
  element.style.backgroundColor = `var(--${token})`;
}

// 동적 스타일 생성 함수
function createButtonStyles(
  variant: "primary" | "secondary" | "ghost" = "primary",
) {
  const baseStyles = {
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    borderRadius: tokens.radius.sm,
    border: "none",
    cursor: "pointer" as const,
    transition: "all 0.2s ease",
  };

  const variantStyles = {
    primary: {
      backgroundColor: tokens.accent.solid,
      color: "var(--color-text-inverse)",
    },
    secondary: {
      backgroundColor: tokens.background.surface,
      color: tokens.text.primary,
      border: "1px solid var(--color-border-default)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: tokens.accent.solid,
    },
  };

  return { ...baseStyles, ...variantStyles[variant] };
}

// ============================================================================
// 메인 예제 컴포넌트
// ============================================================================

const TokenUsageExamples = () => {
  return (
    <div style={{ padding: tokens.spacing.xl }}>
      <h1
        style={{ color: tokens.accent.solid, marginBottom: tokens.spacing.lg }}
      >
        🎯 개선된 Design Token 사용 예제
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.lg,
        }}
      >
        <BasicUsageExample />
        <TypeSafeExample />
        <StatusColorsExample />
        <ThemeToggleExample />
      </div>

      <div style={{ marginTop: tokens.spacing.xl }}>
        <h2 style={{ color: tokens.text.primary }}>CSS-in-JS 예제 코드:</h2>
        <pre
          style={{
            backgroundColor: tokens.background.surface,
            color: tokens.text.primary,
            padding: tokens.spacing.md,
            borderRadius: tokens.radius.sm,
            overflow: "auto",
            fontSize: "14px",
          }}
        >
          {StyledComponentExample}
        </pre>
      </div>
    </div>
  );
};

export default TokenUsageExamples;
