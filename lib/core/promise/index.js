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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
function isControllablePromise(obj) {
  return Object.isPromiseLike(obj) && 'resolve' in obj;
}
/**
 * Creates a promise that can be resolved from the "outside"
 *
 * @param opts - additional options
 * @typeparam T - promise constructor
 *
 * @example
 * ```js
 * const promise = createControllablePromise();
 * promise.resolve(10);
 * ```
 */


function createControllablePromise(opts = {}) {
  const Constr = opts.type ?? Promise,
        args = opts.args ?? [];
  let isPending = true;
  let resolve, reject;

  const executor = (res, rej, ...args) => {
    resolve = (...args) => {
      isPending = false; // eslint-disable-next-line no-useless-call

      res.call(null, ...args);
    };

    reject = (...args) => {
      isPending = false; // eslint-disable-next-line no-useless-call

      rej.call(null, ...args);
    };

    opts.executor?.(resolve, reject, ...args);
  }; // @ts-ignore (args is an iterable)


  const promise = new Constr(executor, ...args);

  if (!('isPending' in promise)) {
    Object.defineProperty(promise, 'isPending', {
      enumerable: true,
      configurable: true,

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