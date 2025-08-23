/**
 * 명시적으로 "에러를 무시하겠다"는 의도를 드러내기 위한 스타일적인 요소로 사용되는 함수
 */
const noop = () => {};

/**
 * batchRequestsOf 함수는 동일한 인자로 호출되는 비동기 함수를 하나로 묶어 실행합니다.
 * 동일한 인자를 사용하여 여러 번 호출할 경우, 이미 진행 중인 Promise를 반환합니다.
 * 새로운 호출에 대해 결과가 완료되면 내부 캐시(promiseByKey)에서 해당 키를 제거합니다.
 * @template F - 호출할 비동기 함수의 타입
 * @param func - 동일한 인자로 호출될 비동기 함수
 * @returns - 동일한 인자를 사용한 호출을 하나로 묶어 실행하는 래핑된 함수
 * @example
    const fetchUser = batchRequestsOf(async (id: number) => {
      console.log(Fetching user ${id});
      return { id, name: "User " + id };
    });
    fetchUser(1).then(console.log); // "Fetching user 1" -> { id: 1, name: "User 1" }
    fetchUser(1).then(console.log); // (캐시된 결과를 반환)
    fetchUser(2).then(console.log); // "Fetching user 2" -> { id: 2, name: "User 2" } 
*/
export function batchRequestsOf<F extends (...args: any[]) => any>(func: F) {
  const promiseByKey = new Map<string, Promise<ReturnType<F>>>();

  return function (...args: Parameters<F>) {
    const key = JSON.stringify(args);

    if (promiseByKey.has(key)) {
      return promiseByKey.get(key)!;
    } else {
      const promise = func(...args);
      promise.then(() => {
        promiseByKey.delete(key);
      }, noop);
      promiseByKey.set(key, promise);

      return promise;
    }
  } as F;
}
