"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSessionStorage = exports.syncLocalStorage = exports.asyncSessionStorage = exports.asyncLocalStorage = void 0;
var _env = require("../../../core/env");
let syncLocalStorage, asyncLocalStorage, syncSessionStorage, asyncSessionStorage;
exports.asyncSessionStorage = asyncSessionStorage;
exports.syncSessionStorage = syncSessionStorage;
exports.asyncLocalStorage = asyncLocalStorage;
exports.syncLocalStorage = syncLocalStorage;
if (_env.IS_NODE) {
  ({
    syncLocalStorage,
    asyncLocalStorage,
    syncSessionStorage,
    asyncSessionStorage
  } = require('../../../core/kv-storage/engines/node-localstorage'));
  exports.syncLocalStorage = syncLocalStorage, exports.asyncLocalStorage = asyncLocalStorage, exports.syncSessionStorage = syncSessionStorage, exports.asyncSessionStorage = asyncSessionStorage;
} else {
  ({
    syncLocalStorage,
    asyncLocalStorage,
    syncSessionStorage,
    asyncSessionStorage
  } = require('../../../core/kv-storage/engines/browser-localstorage'));
  exports.syncLocalStorage = syncLocalStorage, exports.asyncLocalStorage = asyncLocalStorage, exports.syncSessionStorage = syncSessionStorage, exports.asyncSessionStorage = asyncSessionStorage;
}