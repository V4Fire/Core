"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weakMemoizeCache = exports.longMemoizeCache = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const weakMemoizeCache = new WeakMap(),
      longMemoizeCache = new Map();
exports.longMemoizeCache = longMemoizeCache;
exports.weakMemoizeCache = weakMemoizeCache;