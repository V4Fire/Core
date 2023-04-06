"use strict";

try {
  const fnNameRgxp = /^function\s+([^\s(]+)/;
  Object.defineProperty(Function.prototype, 'name', {
    get() {
      const v = fnNameRgxp.exec(this.toString());
      return v?.[1] ?? undefined;
    }
  });
} catch {}