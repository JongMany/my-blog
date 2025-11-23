export type RetryOpts = {
  retries?: number; // 총 시도 횟수
  baseDelay?: number; // 첫 대기(ms)
  factor?: number; // 지수 백오프 배수
  timeoutMsPerTry?: number; // 1회 시도 타임아웃
  onAttempt?: (n: number, err: unknown) => void;
};

export async function importWithRetry<T>(
  loader: () => Promise<T>,
  {
    retries = 5,
    baseDelay = 500,
    factor = 1.6,
    timeoutMsPerTry = 0,
    onAttempt,
  }: RetryOpts = {}
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      if (timeoutMsPerTry > 0) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort("timeout"), timeoutMsPerTry);
        // @ts-expect-error: optional signal usage if loader supports it
        const p = loader(ctrl.signal);
        const res = await p;
        clearTimeout(t);
        return res;
      }
      return await loader();
    } catch (e) {
      attempt++;
      onAttempt?.(attempt, e);
      if (attempt > retries) throw e;
      const delay = Math.round(baseDelay * Math.pow(factor, attempt - 1));
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
