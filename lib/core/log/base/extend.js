"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Mixes two objects
 *
 * @param factory
 * @param records
 */
function extend(factory, records) {
  return Object.mixin(false, factory, records);
}