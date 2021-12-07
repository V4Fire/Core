"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitLikeEvents = exports.dataProviderMethodsToReplace = exports.asyncOptionsKeys = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const emitLikeEvents = ['emit', 'fire', 'dispatch', 'dispatchEvent'];
exports.emitLikeEvents = emitLikeEvents;
const dataProviderMethodsToReplace = ['get', 'peek', 'post', 'add', 'upd', 'del'];
exports.dataProviderMethodsToReplace = dataProviderMethodsToReplace;
const asyncOptionsKeys = ['group', 'label', 'join'];
exports.asyncOptionsKeys = asyncOptionsKeys;