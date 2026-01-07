declare global {
  var __ELONGATOR_STORE__: Map<string, string> | undefined;
}

export const store =
  global.__ELONGATOR_STORE__ ?? (global.__ELONGATOR_STORE__ = new Map<string, string>());
