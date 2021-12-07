"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isZombieGroup = exports.isPromisifyNamespace = exports.isPromisifyLinkName = exports.asyncCounter = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const asyncCounter = Symbol('Async counter id');
exports.asyncCounter = asyncCounter;
const isZombieGroup = /:zombie\b/;
exports.isZombieGroup = isZombieGroup;
const isPromisifyNamespace = /Promise$/,

/** @deprecated */
isPromisifyLinkName = isPromisifyNamespace;
exports.isPromisifyLinkName = isPromisifyLinkName;
exports.isPromisifyNamespace = isPromisifyNamespace;