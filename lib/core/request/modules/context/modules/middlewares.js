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
    const key = this.cacheKey,
      cache = this.pendingCache,
      cacheVal = key != null ? cache.get(key) : null;
    const canCache = key != null && (0, _promise.isControllablePromise)(cacheVal) && this.params.engine.pendingCache !== false;
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
      const pendingRequest = Object.cast(cacheVal).resolve(promise);
      pendingRequest.catch(() => {});
      void cache.set(key, pendingRequest);
    }
    return promise;
  }
  saveCache(resObj) {
    const key = this.cacheKey;
    return new _sync.default((resolve, reject) => {
      if (key != null) {
        const save = () => {
          resObj.data.then(data => {
            resolve(resObj);
            if (_const.caches.has(this.cache)) {
              void this.cache.set(key, data);
            }
          }).catch(reject);
        };
        const {
          response
        } = resObj;
        if (response.bodyUsed) {
          save();
        } else if (!response.streamUsed) {
          const {
            emitter
          } = response;
          const saveAndClear = () => {
            save();
            emitter.off('bodyUsed', clear);
          };
          const clear = () => {
            resolve(resObj);
            emitter.off('bodyUsed', saveAndClear);
          };
          emitter.once('bodyUsed', saveAndClear);
          emitter.once('streamUsed', clear);
        }
        _const.caches.add(this.cache);
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