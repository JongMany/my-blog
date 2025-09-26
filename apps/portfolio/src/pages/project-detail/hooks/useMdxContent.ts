import { useState, useEffect, useCallback } from "react";
import { createMdxComponent } from "../utils/mdx";

/**
 * MDX 콘텐츠를 처리하는 커스텀 훅
 */
export function useMdxContent(mdxSource: string | null) {
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 상태 초기화
  const resetState = useCallback(() => {
    setMDXComponent(null);
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    // 소스가 없으면 상태 초기화
    if (!mdxSource) {
      resetState();
      return;
    }

    let cancelled = false;

    const processMdx = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const component = await createMdxComponent(mdxSource);

        if (!cancelled) {
          setMDXComponent(() => component);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    processMdx();

    return () => {
      cancelled = true;
    };
  }, [mdxSource, resetState]);

  return {
    MDXComponent,
    isLoading,
    error,
  };
}
