"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Merges the specified arguments and returns a new object
 * @param args
 */
function merge(...args) {
  return Object.mixin({
    deep: true,
    concatArrays: (a, b) => a.union(b),
    extendFilter: el => Array.isArray(el) || Object.isDictionary(el)
  }, undefined, ...args);
}