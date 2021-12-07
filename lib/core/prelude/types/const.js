"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toString = exports.nonPrimitiveTypes = exports.isNative = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const isNative = /\[native code]/,
      nonPrimitiveTypes = {
  object: true,
  function: true
};
exports.nonPrimitiveTypes = nonPrimitiveTypes;
exports.isNative = isNative;
const // eslint-disable-next-line @typescript-eslint/unbound-method
{
  toString
} = Object.prototype;
exports.toString = toString;