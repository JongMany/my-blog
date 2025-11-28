import * as React from "react";

/**
 * radix-ui 스타일 패턴으로 Context를 생성합니다
 * - https://github.com/radix-ui/primitives/blob/main/packages/react/context/src/create-context.tsx
 * - https://www.seonest.net/posts/react/complex-context-apis
 *
 * 이 함수는 React Context와 함께 Provider 컴포넌트와 useContext 훅을 생성합니다.
 * Provider는 context value 속성들을 props로 받으며(spread), 훅은
 * 타입 안전한 context 접근과 유용한 에러 메시지를 제공합니다.
 *
 * @example
 * ```tsx
 * const [ViewportProvider, useViewport] = createContext("Viewport");
 *
 * function App() {
 *   return (
 *     <ViewportProvider width={1024} isMobile={false}>
 *       <Child />
 *     </ViewportProvider>
 *   );
 * }
 *
 * function Child() {
 *   const viewport = useViewport("Child");
 *   return <div>{viewport.width}</div>;
 * }
 * ```
 */
/**
 * Compound Component pattern을 위한 React.createContext 활용
 * 컨텍스트 생성 후 provider를 통해 value 공동 사용
 *
 * @param rootComponentName - 컴포넌트 이름 (에러 메시지 및 displayName에 사용)
 * @param defaultContext - 기본 context 값 (선택사항)
 * @returns [Provider, useContext] 튜플
 */
function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContext,
  );
  // 개발자 모드에서 디버깅 목적으로 displayName 설정
  Context.displayName = rootComponentName + "Context";

  /**
   * Provider 컴포넌트
   * context value 속성들을 props로 받아서 Context.Provider에 전달
   *
   * useMemo를 사용하여 context 객체의 값들이 변경될 때만 재메모이제이션
   * 이 패턴은 특히 React의 컨텍스트를 사용하여 글로벌 상태를 관리할 때 유용
   */
  const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (
    props,
  ) => {
    const { children, ...context } = props;
    // prop 값이 변경될 때만 재메모이제이션
    // context 객체의 값들을 의존성 배열로 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(
      () => context,
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  // 개발자 모드에서 디버깅 목적으로 displayName 설정
  Provider.displayName = rootComponentName + "Provider";

  /**
   * useContext 훅
   * 위에서 생성한 컨텍스트의 value들을 반환
   * 유효하지 않은 값이면 에러 처리
   *
   * @param consumerName - consumer 컴포넌트 이름 (에러 메시지에 사용)
   * @returns context value
   * @throws {Error} context가 없고 defaultContext도 없으면 에러 발생
   */
  function useContext(consumerName: string) {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // defaultContext가 지정되지 않았다면 필수 context입니다.
    throw new Error(
      `\`${consumerName}\` must be used within \`${rootComponentName}\``,
    );
  }

  // as const를 사용하면 TypeScript는 반환되는 배열을 튜플(tuple)로 인식하게 되어,
  // 배열의 각 요소의 타입과 순서가 정확하게 유지됩니다.
  return [Provider, useContext] as const;
}

/* -------------------------------------------------------------------------------------------------
 * createContextScope
 * -----------------------------------------------------------------------------------------------*/

type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope };
interface CreateScope {
  scopeName: string;
  (): ScopeHook;
}

/**
 * React 컴포넌트들 사이에서 공유할 수 있는 컨텍스트 스코프를 생성하는 고급 유틸리티
 *
 * 이 함수는 특히 대규모 애플리케이션 또는 라이브러리에서 여러 컨텍스트를 관리할 때 유용합니다.
 * 각 컨텍스트는 특정 범위 내에서 데이터를 공유하고, 동일한 스코프 내의 컴포넌트들은 이 데이터에 접근할 수 있습니다.
 * 여러 컨텍스트를 하나의 스코프로 묶고 관리할 수 있는 기능을 제공합니다.
 *
 * @param scopeName - 스코프 이름
 * @param createContextScopeDeps - 의존성 스코프 배열
 * @returns [createContext, createScope] 튜플
 *
 * @example
 * ```tsx
 * const [createDialogContext, createDialogScope] = createContextScope("Dialog");
 * const [DialogProvider, useDialog] = createDialogContext("Dialog");
 * ```
 */
function createContextScope(
  scopeName: string,
  createContextScopeDeps: CreateScope[] = [],
) {
  let defaultContexts: any[] = [];

  /* -----------------------------------------------------------------------------------------------
   * createContext
   * ---------------------------------------------------------------------------------------------*/

  /**
   * 컨텍스트 생성
   * 그 컨텍스트를 스코프에 속하게 만들기 위해 defaultContexts 배열에 해당 컨텍스트의 기본값을 추가
   */
  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(
      defaultContext,
    );
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    // 스코프에 속한 컨텍스트들을 추적하기 위해 배열에 추가
    defaultContexts = [...defaultContexts, defaultContext];

    /**
     * Provider 컴포넌트 (scoped 버전)
     * scope를 통해 스코프 내의 특정 컨텍스트를 사용하거나, 없으면 BaseContext 사용
     */
    const Provider: React.FC<
      ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
      }
    > = (props) => {
      const { scope, children, ...context } = props;
      // scope가 있으면 스코프 내의 컨텍스트를 사용, 없으면 기본 컨텍스트 사용
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      // prop 값이 변경될 때만 재메모이제이션
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const value = React.useMemo(
        () => context,
        Object.values(context),
      ) as ContextValueType;
      return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    Provider.displayName = rootComponentName + "Provider";

    /**
     * useContext 훅 (scoped 버전)
     * scope를 통해 스코프 내의 특정 컨텍스트를 사용하거나, 없으면 BaseContext 사용
     */
    function useContext(
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
    ) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = React.useContext(Context);
      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;
      // defaultContext가 지정되지 않았다면 필수 context입니다.
      throw new Error(
        `\`${consumerName}\` must be used within \`${rootComponentName}\``,
      );
    }

    return [Provider, useContext] as const;
  }

  /* -----------------------------------------------------------------------------------------------
   * createScope
   * ---------------------------------------------------------------------------------------------*/

  /**
   * 생성된 모든 컨텍스트에 대한 기본 컨텍스트 객체를 생성
   * 해당 함수는 useScope 훅도 같이 반환하는데 이를 통해 스코프에 포함된 모든 컨텍스트를 제공하고,
   * 각 컨텍스트의 현재 값을 포함하는 객체를 반환
   * 묶여진 컨텍스트끼리의 스코프 생성
   */
  const createScope: CreateScope = () => {
    // 각 defaultContext에 대해 새로운 Context 인스턴스 생성
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React.createContext(defaultContext);
    });
    return function useScope(scope: Scope) {
      // scope가 있으면 사용, 없으면 기본 scopeContexts 사용
      const contexts = scope?.[scopeName] || scopeContexts;
      return React.useMemo(
        () => ({
          [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts },
        }),
        [scope, contexts],
      );
    };
  };

  createScope.scopeName = scopeName;
  return [
    createContext,
    composeContextScopes(createScope, ...createContextScopeDeps),
  ] as const;
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/

/**
 * 여러 컨텍스트 스코프를 하나의 복합 스코프로 결합하는 역할
 *
 * 인수로 받은 overrideScopes를 기반으로 각 스코프의 상태를 계산하고,
 * 모든 스코프의 상태를 하나의 객체로 병합합니다.
 *
 * @param scopes - 합성할 스코프들
 * @returns 합성된 스코프
 */
function composeContextScopes(
  ...scopes: [CreateScope, ...CreateScope[]]
): CreateScope {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: CreateScope = () => {
    // 각 스코프의 useScope 훅과 scopeName을 매핑
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }));

    /**
     * 합성된 스코프를 사용하는 훅
     * 모든 스코프의 상태를 하나로 병합
     */
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce(
        (nextScopes, { useScope, scopeName }) => {
          // React는 일관성 없는 렌더링을 피하기 위해 콜백 내부에서 hook 호출을 경고하지만,
          // scoping은 렌더링 부작용이 없으므로 이 규칙을 무시합니다.
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes, ...currentScope };
        },
        {},
      );

      return React.useMemo(
        () => ({ [`__scope${baseScope.scopeName}`]: nextScopes }),
        [nextScopes],
      );
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

/* -----------------------------------------------------------------------------------------------*/

export { createContext, createContextScope };
export type { CreateScope, Scope };
