"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventemitter = require("eventemitter2");
var _sync = _interopRequireDefault(require("../../../../../core/promise/sync"));
var _promise = require("../../../../../core/promise");
var _response = _interopRequireDefault(require("../../../../../core/request/response"));
var _const = require("../../../../../core/request/const");
var _methods = _interopRequireDefault(require("../../../../../core/request/modules/context/modules/methods"));
class RequestContext extends _methods.default {
  wrapRequest(promise) {
    const {
      cacheKey,
      pendingCache
    } = this;
    const cacheVal = cacheKey != null ? pendingCache.get(cacheKey) : null;
    const canCache = cacheKey != null && (0, _promise.isControllablePromise)(cacheVal) && this.params.engine.pendingCache !== false;
    if (canCache) {
      promise = promise.then(res => {
        void pendingCache.remove(cacheKey);
        return res;
      }, reason => {
        void pendingCache.remove(cacheKey);
        throw reason;
      }, () => {
        void pendingCache.remove(cacheKey);
      });
      const pendingRequest = Object.cast(cacheVal).resolve(promise);
      pendingRequest.catch(() => {});
      void pendingCache.set(cacheKey, pendingRequest);
    }
    return promise;
  }
  saveCache(requestResponse) {
    const {
      cacheKey,
      cache
    } = this;
    return new _sync.default((resolve, reject) => {
      if (cacheKey != null) {
        const saveCache = () => {
          requestResponse.data.then(data => {
            resolve(requestResponse);
            if (_const.caches.has(cache)) {
              void cache.set(cacheKey, data);
            }
          }).catch(reject);
        };
        const {
          response
        } = requestResponse;
        if (response.bodyUsed) {
          saveCache();
        } else if (!response.streamUsed) {
          const {
            emitter
          } = response;
          const saveCacheAndClear = () => {
            saveCache();
            emitter.off('bodyUsed', clear);
          };
          const clear = () => {
            resolve(requestResponse);
            emitter.off('bodyUsed', saveCacheAndClear);
          };
          emitter.once('bodyUsed', saveCacheAndClear);
          emitter.once('streamUsed', clear);
        }
        _const.caches.add(cache);
      }
    });
  }
  wrapAsResponse(value) {
    const response = value instanceof _response.default ? value : new _response.default(value, {
      parent: this.parent,
      responseType: 'object'
    });
    let customData;
    return {
      ctx: this,
      response,
      get data() {
        return customData ?? response.decode();
      },
      set data(val) {
        customData = _sync.default.resolve(val);
      },
      get stream() {
        return response.decodeStream();
      },
      emitter: new _eventemitter.EventEmitter2({
        maxListeners: 100
      }),
      [Symbol.asyncIterator]: response[Symbol.asyncIterator].bind(response),
      dropCache: this.dropCache.bind(this)
    };
  }
}
exports.default = RequestContext;