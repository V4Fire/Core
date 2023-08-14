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
    descriptor.value = method.debounce(delay);
    return descriptor;
  };
}
function throttle(delay) {
  return (target, key, descriptor) => {
    const method = descriptor.value;
    if (!Object.isFunction(method)) {
      throw new TypeError(`descriptor.value is not a function: ${method}`);
    }
    descriptor.value = method.throttle(delay);
    return descriptor;
  };
}