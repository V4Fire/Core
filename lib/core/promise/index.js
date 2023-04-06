"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  isControllablePromise: true,
  createControllablePromise: true
};
exports.createControllablePromise = createControllablePromise;
exports.isControllablePromise = isControllablePromise;
var _interface = require("../../core/promise/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
function isControllablePromise(obj) {
  return Object.isPromiseLike(obj) && 'resolve' in obj;
}
function createControllablePromise(opts = {}) {
  const Constr = opts.type ?? Promise,
    args = opts.args ?? [];
  let isPending = true;
  let resolve, reject;
  const executor = (res, rej, ...args) => {
    resolve = (...args) => {
      isPending = false;
      res.call(null, ...args);
    };
    reject = (...args) => {
      isPending = false;
      rej.call(null, ...args);
    };
    opts.executor?.(resolve, reject, ...args);
  };
  const promise = new Constr(executor, ...args);
  if (!('isPending' in promise)) {
    Object.defineProperty(promise, 'isPending', {
      configurable: true,
      enumerable: true,
      get() {
        return isPending;
      }
    });
  }
  promise.resolve = (...args) => {
    resolve?.(...args);
    return promise;
  };
  promise.reject = (...args) => {
    reject?.(...args);
    return promise;
  };
  return Object.cast(promise);
}