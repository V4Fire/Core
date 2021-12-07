"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  deprecate: true,
  deprecated: true
};
exports.deprecate = deprecate;
exports.deprecated = deprecated;

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
 * [[include:core/functools/deprecation/README.md]]
 * @packageDocumentation
 */
function deprecate(fnOrParams, fn) {
  let p;

  if (Object.isSimpleFunction(fnOrParams)) {
    fn = fnOrParams;
    p = {};
  } else {
    p = fnOrParams;
  }

  return Object.cast((0, _warning.warn)({
    context: 'deprecated',
    ...p
  }, fn));
}
/**
 * Decorator for `deprecate`
 *
 * @decorator
 * @see [[deprecate]]
 */


function deprecated(opts, key, descriptor) {
  if (arguments.length > 1) {
    (0, _warning.warned)({
      context: 'deprecated'
    })(opts, key, descriptor);
    return;
  }

  return (target, key, descriptor) => (0, _warning.warned)({
    context: 'deprecated',
    ...opts
  })(target, key, descriptor);
}