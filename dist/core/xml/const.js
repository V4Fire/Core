"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeRgxp = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const normalizeRgxp = /"|(\s+)|[{}|\\^~[\]`"<>#%]/g;
exports.normalizeRgxp = normalizeRgxp;