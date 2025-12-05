import type { SerializeConfig } from "../../types";

/**
 * Builder Pattern: SerializeConfig를 단계적으로 생성
 */
export class SerializeConfigBuilder {
  private config: SerializeConfig = {
    remarkPlugins: [],
    rehypePlugins: [],
  };

  /**
   * Remark 플러그인 추가
   */
  addRemarkPlugin(plugin: any, options?: any): this {
    const plugins = this.config.remarkPlugins ?? [];
    if (options) {
      this.config.remarkPlugins = [...plugins, [plugin, options]];
    } else {
      this.config.remarkPlugins = [...plugins, plugin];
    }
    return this;
  }

  /**
   * Rehype 플러그인 추가
   */
  addRehypePlugin(plugin: any, options?: any): this {
    const plugins = this.config.rehypePlugins ?? [];
    if (options) {
      this.config.rehypePlugins = [...plugins, [plugin, options]];
    } else {
      this.config.rehypePlugins = [...plugins, plugin];
    }
    return this;
  }

  /**
   * 소스 정제 함수 설정
   */
  withSanitizeSource(sanitizeSource: (source: string) => string): this {
    this.config.sanitizeSource = sanitizeSource;
    return this;
  }

  /**
   * 기본 설정으로 초기화
   */
  withDefaults(defaultConfig: SerializeConfig): this {
    this.config = {
      ...defaultConfig,
      remarkPlugins: [...(defaultConfig.remarkPlugins ?? [])],
      rehypePlugins: [...(defaultConfig.rehypePlugins ?? [])],
    };
    return this;
  }

  /**
   * 설정 빌드 (불변 객체 반환)
   */
  build(): SerializeConfig {
    return {
      remarkPlugins: [...(this.config.remarkPlugins ?? [])],
      rehypePlugins: [...(this.config.rehypePlugins ?? [])],
      sanitizeSource: this.config.sanitizeSource,
    };
  }

  /**
   * 정적 팩토리 메서드: 새 빌더 인스턴스 생성
   */
  static create(): SerializeConfigBuilder {
    return new SerializeConfigBuilder();
  }

  /**
   * 정적 팩토리 메서드: 기본 설정으로 시작
   */
  static fromDefaults(defaultConfig: SerializeConfig): SerializeConfigBuilder {
    return new SerializeConfigBuilder().withDefaults(defaultConfig);
  }
}

