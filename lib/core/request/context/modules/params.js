"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ttl = _interopRequireDefault(require("../../../../core/cache/decorators/ttl"));

var _persistent = _interopRequireDefault(require("../../../../core/cache/decorators/persistent"));

var _utils = require("../../../../core/request/utils");

var _const = require("../../../../core/request/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class RequestContext {
  /**
   * Promise of instance initializing
   */

  /**
   * True if the request can be cached
   */

  /**
   * String key to cache the request
   */

  /**
   * Storage to cache the request
   */

  /**
   * Storage to cache the pending request
   */
  pendingCache = Object.cast(_const.pendingCache);
  /**
   * True if the request can provide parameters only as a query string
   */

  /**
   * Alias for query parameters of the request
   */
  get query() {
    return this.params.query;
  }
  /**
   * Cache TTL identifier
   */


  /**
   * @param [params] - request parameters
   */
  constructor(params) {
    const p = (0, _utils.merge)({}, params);
    this.params = p;

    if (p.encoder == null) {
      this.encoders = [];
    } else {
      this.encoders = Object.isFunction(p.encoder) ? [p.encoder] : p.encoder;
    }

    if (p.decoder == null) {
      this.decoders = [];
    } else {
      this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : p.decoder;
    }

    this.withoutBody = Boolean(_const.methodsWithoutBody[p.method]);
    this.canCache = p.cacheMethods.includes(p.method) || false;
    let cacheAPI = (Object.isString(p.cacheStrategy) ? _const.cache[p.cacheStrategy] : p.cacheStrategy) ?? _const.cache.never;

    this.isReady = (async () => {
      // eslint-disable-next-line require-atomic-updates
      cacheAPI = await cacheAPI;

      if (p.cacheTTL != null) {
        cacheAPI = (0, _ttl.default)(cacheAPI, p.cacheTTL);
      }

      if (p.offlineCache === true && _const.storage != null) {
        const storageAPI = await _const.storage; // eslint-disable-next-line require-atomic-updates

        cacheAPI = await (0, _persistent.default)(cacheAPI, storageAPI, {
          persistentTTL: p.offlineCacheTTL,
          loadFromStorage: 'onOfflineDemand'
        });
      }

      Object.set(this, 'cache', cacheAPI);

      _const.caches.add(cacheAPI);
    })();
  }

}

exports.default = RequestContext;