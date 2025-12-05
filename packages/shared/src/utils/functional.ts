/**
 * 함수형 프로그래밍 유틸리티
 * 범용적으로 사용 가능한 함수형 프로그래밍 헬퍼 함수들
 */

import { isObject } from "./type-guards";

/**
 * 함수 합성: 여러 함수를 순차적으로 실행 (왼쪽에서 오른쪽으로)
 *
 * @example
 * ```ts
 * const add1 = (x: number) => x + 1;
 * const multiply2 = (x: number) => x * 2;
 * const result = pipe(add1, multiply2)(5); // (5 + 1) * 2 = 12
 * ```
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => {
    return fns.reduce((acc, fn) => fn(acc), value);
  };

/**
 * 함수 합성: 여러 함수를 역순으로 실행 (오른쪽에서 왼쪽으로)
 *
 * @example
 * ```ts
 * const add1 = (x: number) => x + 1;
 * const multiply2 = (x: number) => x * 2;
 * const result = compose(add1, multiply2)(5); // (5 * 2) + 1 = 11
 * ```
 */
export const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };

/**
 * 불변 객체 병합: 깊은 병합을 수행
 *
 * @example
 * ```ts
 * const merged = deepMerge(
 *   { a: 1, b: { c: 2 } },
 *   { b: { d: 3 } },
 *   { a: 4 }
 * );
 * // { a: 4, b: { c: 2, d: 3 } }
 * ```
 */
export const deepMerge = <T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) return { ...target };
  const source = sources.shift();
  if (!source) return { ...target };

  const result = { ...target };

  if (isObject(result) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        result[key] = isObject(result[key])
          ? (deepMerge(
              result[key] as Record<string, unknown>,
              source[key] as Record<string, unknown>,
            ) as T[Extract<keyof T, string>])
          : ({ ...(source[key] as Record<string, unknown>) } as T[Extract<
              keyof T,
              string
            >]);
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return deepMerge(result, ...sources);
};

/**
 * 커링: 함수를 부분 적용 가능하게 만듦
 *
 * @example
 * ```ts
 * const add = (a: number, b: number) => a + b;
 * const curriedAdd = curry(add);
 * const add5 = curriedAdd(5);
 * const result = add5(3); // 8
 * ```
 */
export const curry =
  <A, B, C>(fn: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B): C => {
    return fn(a, b);
  };

/**
 * 부분 적용: 함수의 일부 인자를 미리 적용
 *
 * @example
 * ```ts
 * const multiply = (a: number, b: number, c: number) => a * b * c;
 * const multiplyBy2 = partial(multiply, 2);
 * const result = multiplyBy2(3, 4); // 2 * 3 * 4 = 24
 * ```
 */
export const partial =
  <T extends (...args: any[]) => any>(fn: T, ...partialArgs: Parameters<T>) =>
  (...remainingArgs: Parameters<T>): ReturnType<T> => {
    return fn(...partialArgs, ...remainingArgs);
  };
