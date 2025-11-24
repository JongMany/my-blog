import { useState, useEffect, type ComponentType } from "react";
import { createMdxComponent } from "../utils";

export function useMdxContent(mdxSource: string | null) {
  const [MDXComponent, setMDXComponent] = useState<ComponentType | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!mdxSource) {
      setMDXComponent(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const processMdx = async () => {
      try {
        setError(null);
        const component = await createMdxComponent(mdxSource);

        if (!cancelled) {
          setMDXComponent(() => component);
        }
      } catch (err: any) {
        if (!cancelled) {
          setMDXComponent(null);
          setError(err);
        }
      }
    };

    processMdx();

    return () => {
      cancelled = true;
    };
  }, [mdxSource]);

  return {
    MDXComponent,
    error,
  };
}
