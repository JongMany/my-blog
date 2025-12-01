/**
 * JSONP로 API 호출 (CORS 우회)
 *
 * JSONP는 <script> 태그를 이용해 CORS 제한을 우회하는 기법입니다.
 * 서버는 callback 파라미터로 전달된 함수명을 사용해 JavaScript 코드를 반환합니다.
 */

// ===== 상수 =====

const DEFAULT_TIMEOUT_MS = 15000;
const CALLBACK_PREFIX = "__jsonp_";

const ERROR_MESSAGES = {
  TIMEOUT: "요청 시간 초과",
  SCRIPT_LOAD_FAILED: "스크립트 로드 실패",
} as const;

// ===== 타입 =====

type JsonpCallback<T> = (data: T) => void;

type WindowWithJsonpCallback = Window &
  Record<string, JsonpCallback<unknown> | unknown>;

// ===== 함수 =====

/**
 * JSONP로 API 호출
 *
 * @param url - API URL (callback 파라미터는 자동으로 추가됨)
 * @param timeoutMs - 타임아웃 시간 (밀리초), 기본값 15000ms
 * @returns Promise<T> - API 응답 데이터
 */
export function requestJsonp<T = unknown>(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = generateUniqueCallbackName();
    const script = document.createElement("script");
    let isFinished = false;
    const windowWithCallback = window as unknown as WindowWithJsonpCallback;

    const cleanup = () => {
      if (isFinished) return;
      isFinished = true;
      script.remove();
      delete windowWithCallback[callbackName];
    };

    const handleTimeout = () => {
      cleanup();
      reject(new Error(ERROR_MESSAGES.TIMEOUT));
    };

    const handleScriptError = () => {
      cleanup();
      clearTimeout(timeoutId);
      reject(new Error(ERROR_MESSAGES.SCRIPT_LOAD_FAILED));
    };

    const handleJsonpCallback: JsonpCallback<T> = (data: T) => {
      cleanup();
      clearTimeout(timeoutId);
      resolve(data);
    };

    const timeoutId = setTimeout(handleTimeout, timeoutMs);

    windowWithCallback[callbackName] = handleJsonpCallback;
    script.onerror = handleScriptError;

    const urlSeparator = url.includes("?") ? "&" : "?";
    script.src = `${url}${urlSeparator}callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

// ===== 헬퍼 함수 =====

function generateUniqueCallbackName(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2);
  return `${CALLBACK_PREFIX}${timestamp}_${random}`;
}
