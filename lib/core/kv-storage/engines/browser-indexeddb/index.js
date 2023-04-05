"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSessionStorage = exports.syncLocalStorage = exports.asyncSessionStorage = exports.asyncLocalStorage = void 0;
var _cache = require("../../../../core/cache");
var _syncEngine = _interopRequireDefault(require("../../../../core/kv-storage/engines/browser-indexeddb/sync-engine"));
var _asyncEngine = _interopRequireDefault(require("../../../../core/kv-storage/engines/browser-indexeddb/async-engine"));
const asyncLocalEngine = new _asyncEngine.default(),
  sessionEngine = new _cache.Cache();
const syncLocalStorage = _syncEngine.default,
  asyncLocalStorage = asyncLocalEngine;
exports.asyncLocalStorage = asyncLocalStorage;
exports.syncLocalStorage = syncLocalStorage;
let syncSessionStorage, asyncSessionStorage;
exports.asyncSessionStorage = asyncSessionStorage;
exports.syncSessionStorage = syncSessionStorage;
if (typeof globalThis.sessionStorage !== 'undefined') {
  exports.syncSessionStorage = syncSessionStorage = globalThis.sessionStorage;
  exports.asyncSessionStorage = asyncSessionStorage = globalThis.sessionStorage;
} else {
  exports.syncSessionStorage = syncSessionStorage = sessionEngine;
  exports.asyncSessionStorage = asyncSessionStorage = sessionEngine;
}