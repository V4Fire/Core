"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSessionStorage = exports.syncLocalStorage = exports.asyncSessionStorage = exports.asyncLocalStorage = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
// eslint-disable-next-line import/no-mutable-exports
let syncLocalStorage, asyncLocalStorage;
exports.asyncLocalStorage = asyncLocalStorage;
exports.syncLocalStorage = syncLocalStorage;
const syncSessionStorage = globalThis.sessionStorage,
      asyncSessionStorage = globalThis.sessionStorage;
exports.asyncSessionStorage = asyncSessionStorage;
exports.syncSessionStorage = syncSessionStorage;

try {
  if (typeof globalThis.localStorage !== 'undefined') {
    exports.syncLocalStorage = syncLocalStorage = globalThis.localStorage;
    exports.asyncLocalStorage = asyncLocalStorage = globalThis.localStorage;
  }
} catch {
  exports.syncLocalStorage = syncLocalStorage = syncSessionStorage;
  exports.asyncLocalStorage = asyncLocalStorage = asyncSessionStorage;
}