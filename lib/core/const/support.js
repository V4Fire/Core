"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxy = void 0;
const proxy = (() => {
  try {
    const obj = new Proxy({
      a: 1
    }, {
      defineProperty(target, key, desc) {
        return Reflect.defineProperty(target, key, desc);
      }
    });
    obj.a = 2;
    return Object.keys(obj).toString() === 'a';
  } catch {
    return false;
  }
})();
exports.proxy = proxy;