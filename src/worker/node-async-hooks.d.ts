// Provided by the Workers runtime via the nodejs_compat flag (wrangler.toml).
// The worker tsconfig doesn't load @types/node, so declare just what we use.
declare module 'node:async_hooks' {
  export class AsyncLocalStorage<T> {
    getStore(): T | undefined;
    run<R>(store: T, callback: () => R): R;
  }
}
