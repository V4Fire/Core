"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defReadonlyProp = exports.defProp = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const defProp = Object.freeze({
  configurable: true,
  enumerable: true,
  writable: true,
  value: undefined
});
exports.defProp = defProp;
const defReadonlyProp = Object.freeze({
  configurable: true,
  enumerable: true,
  writable: false,
  value: undefined
});
exports.defReadonlyProp = defReadonlyProp;