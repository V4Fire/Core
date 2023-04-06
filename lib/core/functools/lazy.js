"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;
exports.throttle = throttle;
function debounce(delay) {
  return (target, key, descriptor) => {
    const method = descriptor.value;
    if (!Object.isFunction(method)) {
      throw new TypeError(`descriptor.value is not a function: ${method}`);
    }
    descriptor.value = function value(...args) {
      Object.defineProperty(this, key, {
        configurable: true,
        value: method.debounce(delay)
      });
      return this[key](...args);
    };
  };
}
function throttle(delay) {
  return (target, key, descriptor) => {
    const method = descriptor.value;
    if (!Object.isFunction(method)) {
      throw new TypeError(`descriptor.value is not a function: ${method}`);
    }
    descriptor.value = function value(...args) {
      Object.defineProperty(this, key, {
        configurable: true,
        value: method.throttle(delay)
      });
      return this[key](...args);
    };
  };
}