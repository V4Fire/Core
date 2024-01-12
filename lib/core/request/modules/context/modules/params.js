"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.$$ = void 0;
var _env = require("../../../../../core/env");
var _symbol = _interopRequireDefault(require("../../../../../core/symbol"));
var _ttl = _interopRequireDefault(require("../../../../../core/cache/decorators/ttl"));
var _persistent = _interopRequireDefault(require("../../../../../core/cache/decorators/persistent"));
var _const = require("../../../../../core/request/const");
var _headers = _interopRequireDefault(require("../../../../../core/request/headers"));
var _helpers = require("../../../../../core/request/helpers");
const $$ = (0, _symbol.default)();
exports.$$ = $$;
const cacheStore = Object.createDict();
class RequestContext {
  get cacheKey() {
    return this[$$.cacheKey];
  }
  set cacheKey(value) {
    this[$$.cacheKey] = value;
  }
  pendingCache = Object.cast(_const.pendingCache);
  get query() {
    return this.params.query;
  }
  get headers() {
    return this.params.headers;
  }
  get encoders() {
    return this[$$.encoders];
  }
  set encoders(value) {
    this[$$.encoders] = value;
  }
  get decoders() {
    return this[$$.decoders];
  }
  set decoders(value) {
    this[$$.decoders] = value;
  }
  get streamDecoders() {
    return this[$$.streamDecoders];
  }
  set streamDecoders(value) {
    this[$$.streamDecoders] = value;
  }
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
    let cacheAPI = _env.IS_SSR ? _const.cache.forever : (Object.isString(p.cacheStrategy) ? _const.cache[p.cacheStrategy] : p.cacheStrategy) ?? _const.cache.never;
    if (_env.IS_SSR) {
      delete p.cacheTTL;
      delete p.offlineCache;
    }
    this.isReady = (async () => {
      cacheAPI = await cacheAPI;
      if (p.cacheTTL != null) {
        const wrap = () => (0, _ttl.default)(cacheAPI, p.cacheTTL);
        cacheAPI = await getWrappedCache(`ttl.${p.cacheTTL}`, wrap);
      }
      if (p.offlineCache === true && _const.storage != null) {
        const storageAPI = await _const.storage;
        const wrap = () => (0, _persistent.default)(cacheAPI, storageAPI, {
          persistentTTL: p.offlineCacheTTL,
          loadFromStorage: 'onOfflineDemand'
        });
        cacheAPI = await getWrappedCache(`persistent.${p.offlineCacheTTL}`, wrap);
      }
      Object.set(this, 'cache', cacheAPI);
      _const.caches.add(cacheAPI);
      async function getWrappedCache(key, wrap) {
        cacheStore[key] ??= new WeakMap();
        const store = cacheStore[key];
        if (!store.has(cacheAPI)) {
          store.set(cacheAPI, Object.cast(await wrap()));
        }
        return Object.cast(store.get(cacheAPI));
      }
    })();
  }
}
exports.default = RequestContext;