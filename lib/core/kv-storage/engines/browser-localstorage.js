"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSessionStorage = exports.syncLocalStorage = exports.asyncSessionStorage = exports.asyncLocalStorage = void 0;
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