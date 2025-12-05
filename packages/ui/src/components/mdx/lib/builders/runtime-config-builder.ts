import type { ComponentType, ReactNode } from "react";
import type { MDXRuntimeConfig } from "../../types";

/**
 * Builder Pattern: MDXRuntimeConfig를 단계적으로 생성
 */
export class RuntimeConfigBuilder {
  private config: Partial<MDXRuntimeConfig> = {};

  /**
   * Link 컴포넌트 설정
   */
  withLinkComponent(LinkComponent: ComponentType<{
    to: string;
    children: ReactNode;
    className?: string;
    [key: string]: any;
  }>): this {
    this.config.LinkComponent = LinkComponent;
    return this;
  }

  /**
   * 이미지 소스 처리 함수 설정
   */
  withImageSourceProcessor(
    processImageSource: (src: string, appName: string) => string
  ): this {
    this.config.processImageSource = processImageSource;
    return this;
  }

  /**
   * 앱 이름 설정
   */
  withAppName(appName: string): this {
    this.config.appName = appName;
    return this;
  }

  /**
   * 설정 빌드 (불변 객체 반환)
   */
  build(): MDXRuntimeConfig {
    if (!this.config.LinkComponent) {
      throw new Error("LinkComponent is required");
    }
    if (!this.config.processImageSource) {
      throw new Error("processImageSource is required");
    }
    if (!this.config.appName) {
      throw new Error("appName is required");
    }

    return {
      LinkComponent: this.config.LinkComponent,
      processImageSource: this.config.processImageSource,
      appName: this.config.appName,
    } as MDXRuntimeConfig;
  }

  /**
   * 정적 팩토리 메서드: 새 빌더 인스턴스 생성
   */
  static create(): RuntimeConfigBuilder {
    return new RuntimeConfigBuilder();
  }
}

