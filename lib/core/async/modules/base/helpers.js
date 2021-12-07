"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsyncOptions = isAsyncOptions;
exports.isParams = void 0;

var _functools = require("../../../../core/functools");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is looks like an instance of AsyncOptions
 * @param value
 */
function isAsyncOptions(value) {
  return Object.isPlainObject(value);
}
/**
 * @deprecated
 * @see isAsyncOptions
 */


const isParams = (0, _functools.deprecate)({
  renamedTo: 'isAsyncOptions'
}, function isParams(value) {
  return isAsyncOptions(value);
});
exports.isParams = isParams;