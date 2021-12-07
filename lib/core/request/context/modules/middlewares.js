"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _response = _interopRequireDefault(require("../../../../core/request/response"));

var _const = require("../../../../core/request/const");

var _methods = _interopRequireDefault(require("../../../../core/request/context/modules/methods"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class RequestContext extends _methods.default {
  /**
   * Wraps the specified promise: attaches the pending cache, etc.
   * @param promise
   */
  wrapRequest(promise) {
    const key = this.cacheKey,
          cache = this.pendingCache;
    const canCache = key != null && !cache.has(key) && this.params.engine.pendingCache !== false;

    if (canCache) {
      promise = promise.then(v => {
        void cache.remove(key);
        return v;
      }, r => {
        void cache.remove(key);
        throw r;
      }, () => {
        void cache.remove(key);
      });
      void cache.set(key, promise);
    }

    return promise;
  }
  /**
   * Middleware to cache a request
   * @param res - response object
   */


  saveCache(res) {
    const key = this.cacheKey;

    if (key != null) {
      void this.cache.set(key, res.data);

      _const.caches.add(this.cache);
    }

    return res;
  }
  /**
   * Middleware to wrap the specified response value with RequestResponseObject
   * @param value
   */


  async wrapAsResponse(value) {
    const response = value instanceof _response.default ? value : new _response.default(value, {
      parent: this.parent,
      responseType: 'object'
    });
    return {
      response,
      ctx: this,
      data: await response.decode(),
      dropCache: this.dropCache.bind(this)
    };
  }

}

exports.default = RequestContext;