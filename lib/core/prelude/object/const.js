"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInvalidKey = exports.funcCache = exports.canParse = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const canParse = /^[[{"]|^(?:true|false|null|(?:0\.)?\d+(?:[eE]\d+)?)$/;
exports.canParse = canParse;
const isInvalidKey = /^__proto__$/;
exports.isInvalidKey = isInvalidKey;
const funcCache = new WeakMap();
exports.funcCache = funcCache;