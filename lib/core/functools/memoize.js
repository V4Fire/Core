"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.once = once;
function once(target, key, descriptor) {
  const method = descriptor.value;
  if (!Object.isFunction(method)) {
    throw new TypeError(`descriptor.value is not a function: ${method}`);
  }
  descriptor.value = function value(...args) {
    Object.defineProperty(this, key, {
      configurable: true,
      value: method.once()
    });
    return this[key](...args);
  };
}