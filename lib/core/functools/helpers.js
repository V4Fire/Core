"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constant = constant;
exports.identity = identity;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns the specified value
 */
function identity(value) {
  return value;
}
/**
 * Returns a function that always returns the specified value
 * @param value
 */


function constant(value) {
  return () => value;
}