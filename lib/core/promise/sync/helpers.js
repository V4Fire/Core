"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoize = memoize;
var _syncPromise = _interopRequireDefault(require("../../../core/prelude/structures/sync-promise"));
var _const = require("../../../core/promise/sync/const");
function memoize(keyOrPromise, promise) {
  return new _syncPromise.default((resolve, reject) => {
    if (keyOrPromise != null && typeof keyOrPromise === 'object') {
      if (_const.weakMemoizeCache.has(keyOrPromise)) {
        return resolve(_const.weakMemoizeCache.get(keyOrPromise));
      }
    } else if (Object.isPrimitive(keyOrPromise) && _const.longMemoizeCache.has(keyOrPromise)) {
      return resolve(_const.longMemoizeCache.get(keyOrPromise));
    }
    let p = promise ?? keyOrPromise;
    p = Object.isFunction(p) ? p() : p;
    if (!Object.isPromise(p)) {
      throw new ReferenceError('A promise to wait is not found');
    }
    p.then(val => {
      if (keyOrPromise != null && typeof keyOrPromise === 'object') {
        _const.weakMemoizeCache.set(keyOrPromise, val);
      } else {
        _const.longMemoizeCache.set(keyOrPromise, val);
      }
      resolve(val);
    }).catch(reject);
  });
}