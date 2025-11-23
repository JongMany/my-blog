import * as React from "react";
import { importWithRetry, type RetryOpts } from "./importRetry";

/** React.lazy + 재시도 */
export function lazyRemote<T extends { default: React.ComponentType<any> }>(
  loader: () => Promise<T>,
  retryOpts?: RetryOpts
) {
  return React.lazy(async () => {
    const mod = await importWithRetry(loader, retryOpts);
    const m = mod as any;
    return { default: (m.default ?? m) as React.ComponentType<any> };
  });
}
