"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromHex = fromHex;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns a symbol from the passed HEX char string
 * @param str
 *
 * @example
 * ```
 * // '😀'
 * console.log(fromHex('0x1f600'));
 * ```
 */
function fromHex(str) {
  return String.fromCodePoint(parseInt(str.slice(2), 16));
}