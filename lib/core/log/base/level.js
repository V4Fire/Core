"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_LEVEL = void 0;
exports.cmpLevels = cmpLevels;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const DEFAULT_LEVEL = 'info';
exports.DEFAULT_LEVEL = DEFAULT_LEVEL;
const order = {
  error: 1,
  warn: 2,
  info: 3
};
/**
 * Compares log levels:
 *
 * < 0 if left < right
 * > 0 if left > right
 * = 0 if left === right
 *
 * @param left
 * @param right
 */

function cmpLevels(left, right) {
  const l = order[left],
        hasL = Object.isTruly(l);
  const r = order[right],
        hasR = Object.isTruly(r);

  if (!hasL && !hasR) {
    return 0;
  }

  if (!hasL) {
    return -1;
  }

  if (!hasR) {
    return 1;
  }

  return l - r;
}