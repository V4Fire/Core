"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  unimplement: true,
  unimplemented: true
};
exports.unimplement = unimplement;
exports.unimplemented = unimplemented;

var _warning = require("../../../core/functools/warning");

var _interface = require("../../../core/functools/warning/interface");

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

/**
 * [[include:core/functools/implementation/README.md]]
 * @packageDocumentation
 */
function unimplement(fnOrParams, fn) {
  let p;

  if (Object.isSimpleFunction(fnOrParams)) {
    fn = fnOrParams;
    p = {};
  } else {
    p = fnOrParams;
  }

  return Object.cast((0, _warning.warn)({
    context: 'unimplemented',
    ...p
  }, fn));
}
/**
 * Decorator for `unimplement`
 *
 * @decorator
 * @see [[unimplement]]
 *
 * @example
 * ```js
 * class Foo {
 *   @unimplemented()
 *   bar() {
 *
 *   }
 * }
 * ```
 */


function unimplemented(opts, key, descriptor) {
  if (arguments.length > 1) {
    (0, _warning.warned)({
      context: 'unimplemented'
    })(opts, key, descriptor);
    return;
  }

  return (target, key, descriptor) => (0, _warning.warned)({
    context: 'unimplemented',
    ...opts
  })(target, key, descriptor);
}