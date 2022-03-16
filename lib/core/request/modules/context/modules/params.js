"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.$$ = void 0;

var _symbol = _interopRequireDefault(require("../../../../../core/symbol"));

var _ttl = _interopRequireDefault(require("../../../../../core/cache/decorators/ttl"));

var _persistent = _interopRequireDefault(require("../../../../../core/cache/decorators/persistent"));

var _const = require("../../../../../core/request/const");

var _headers = _interopRequireDefault(require("../../../../../core/request/headers"));

var _helpers = require("../../../../../core/request/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const $$ = (0, _symbol.default)();
exports.$$ = $$;

class RequestContext {
  /**
   * Promise that resolves when the instance is already initialized
   */

  /**
   * True if the request can be cached
   */

  /**
   * String key to cache the request
   */
  get cacheKey() {
    return this[$$.cacheKey];
  }
  /**
   * Sets a new string key to cache the request
   */


  set cacheKey(value) {
    this[$$.cacheKey] = value;
  }
  /**
   * Storage to cache the resolved request
   */


  /**
   * Storage to cache the request while it is pending a response
   */
  pendingCache = Object.cast(_const.pendingCache);
  /**
   * True if the request can provide parameters only as a query string
   */

  /**
   * Alias for `params.query`
   * @alias
   */
  get query() {
    return this.params.query;
  }
  /**
   * Alias for `params.headers`
   * @alias
   */


  get headers() {
    return this.params.headers;
  }
  /**
   * Sequence of request data encoders
   */


  get encoders() {
    return this[$$.encoders];
  }
  /**
   * Sets a new sequence of request data encoders
   */


  set encoders(value) {
    this[$$.encoders] = value;
  }
  /**
   * Sequence of response data decoders
   */


  get decoders() {
    return this[$$.decoders];
  }
  /**
   * Sets a new sequence of response data decoders
   */


  set decoders(value) {
    this[$$.decoders] = value;
  }
  /**
   * Sequence of response data decoders
   */


  get streamDecoders() {
    return this[$$.streamDecoders];
  }
  /**
   * Sets a new sequence of response data decoders
   */


  set streamDecoders(value) {
    this[$$.streamDecoders] = value;
  }
  /**
   * Link to a parent operation promise
   */


  /**
   * @param [params] - request parameters
   */
  constructor(params) {
    const p = (0, _helpers.merge)({}, params);
    p.headers = new _headers.default(p.headers);
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

    if (p.streamDecoder == null) {
      this.streamDecoders = [];
    } else {
      this.streamDecoders = Object.isFunction(p.streamDecoder) ? [p.streamDecoder] : p.streamDecoder;
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