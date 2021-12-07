"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testCache = exports.isGlobal = exports.escapeRgxp = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const isGlobal = /g/,
      escapeRgxp = /([\\/'*+?|()[\]{}.^$-])/g;
exports.escapeRgxp = escapeRgxp;
exports.isGlobal = isGlobal;
const testCache = Object.createDict();
exports.testCache = testCache;