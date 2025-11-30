import * as React from "react";
import { importWithRetry, type RetryOpts } from "./import-retry";

type ModuleWithDefault<TProps> = { default: React.ComponentType<TProps> };
type RemoteModule<TProps> =
  | ModuleWithDefault<TProps>
  | React.ComponentType<TProps>;

const hasDefaultExport = <TProps,>(
  mod: RemoteModule<TProps>,
): mod is ModuleWithDefault<TProps> => {
  return typeof mod === "object" && mod !== null && "default" in mod;
};

/** React.lazy + 재시도 */
export function lazyRemote<TProps = unknown>(
  loader: () => Promise<RemoteModule<TProps>>,
  retryOpts?: RetryOpts,
) {
  return React.lazy(async () => {
    const mod = await importWithRetry(loader, retryOpts);
    if (hasDefaultExport(mod)) {
      return mod;
    }
    return { default: mod };
  });
}
