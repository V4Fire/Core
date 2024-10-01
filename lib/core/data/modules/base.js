"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  $$: true
};
exports.default = exports.$$ = void 0;
var _eventemitter = require("eventemitter2");
var _symbol = _interopRequireDefault(require("../../../core/symbol"));
var _proxyReadonly = require("../../../core/object/proxy-readonly");
var _implementation = require("../../../core/functools/implementation");
var _functools = require("../../../core/functools");
var _url = require("../../../core/url");
var _async = _interopRequireDefault(require("../../../core/async"));
var _socket = _interopRequireDefault(require("../../../core/socket"));
var _request = require("../../../core/request");
var _const = require("../../../core/data/const");
var _params2 = _interopRequireWildcard(require("../../../core/data/modules/params"));
Object.keys(_params2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _params2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _params2[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const $$ = (0, _symbol.default)();
exports.$$ = $$;
class Provider extends _params2.default {
  get providerName() {
    return this.constructor[_const.namespace];
  }
  get event() {
    (0, _functools.deprecate)({
      name: 'event',
      type: 'accessor',
      renamedTo: 'emitter'
    });
    return this.emitter;
  }
  constructor(opts = {}) {
    super();
    const id = this.getCacheKey(opts),
      cacheVal = _const.instanceCache[id];
    if (opts.singleton !== false) {
      if (cacheVal != null) {
        return cacheVal;
      }
      _const.instanceCache[id] = this;
      _const.requestCache[id] = Object.createDict();
    }
    this.cacheId = id;
    this.params = opts;
    this.async = new _async.default();
    this.emitter = new _eventemitter.EventEmitter2({
      maxListeners: 1e3,
      newListener: false
    });
    if (opts.socket || this.socketURL != null) {
      this.connect().then(this.initSocketBehaviour.bind(this), stderr);
    }
  }
  getCacheKey(paramsForCache = this.params) {
    return `${this.providerName}:${paramsForCache.id}:${Object.fastHash(paramsForCache)}`;
  }
  getAuthParams(_params) {
    return Promise.resolve({});
  }
  resolver(url, params) {
    return undefined;
  }
  async connect(opts) {
    await this.async.wait(() => this.socketURL);
    const {
        socketURL: url
      } = this,
      key = Object.fastHash(opts);
    if (_const.connectCache[key] == null) {
      _const.connectCache[key] = new Promise((resolve, reject) => {
        const socket = (0, _socket.default)(url);
        if (!socket) {
          return;
        }
        function onClear(err) {
          reject(err);
          delete _const.connectCache[key];
        }
        const asyncParams = {
          group: 'connection',
          label: $$.connect,
          join: true,
          onClear
        };
        this.async.worker(socket, asyncParams);
        this.async.once(socket, 'connect', () => resolve(socket), asyncParams);
      });
    }
    return _const.connectCache[key];
  }
  name(value) {
    if (value == null) {
      return this.eventName;
    }
    const obj = Object.create(this);
    obj.eventName = value;
    return obj;
  }
  method(value) {
    if (value == null) {
      return this.customMethod;
    }
    const obj = Object.create(this);
    obj.customMethod = value;
    return obj;
  }
  base(value) {
    if (value == null) {
      return this.baseURL;
    }
    const obj = Object.create(this);
    obj.baseURL = value;
    obj.baseGetURL = undefined;
    obj.basePeekURL = undefined;
    obj.baseAddURL = undefined;
    obj.baseUpdateURL = undefined;
    obj.baseDeleteURL = undefined;
    return obj;
  }
  url(value) {
    if (value == null) {
      return (0, _url.concatURLs)(this.baseURL, this.advURL);
    }
    const obj = Object.create(this);
    obj.advURL = value;
    return obj;
  }
  dropCache(recursive) {
    const cache = _const.requestCache[this.cacheId];
    if (cache != null) {
      Object.values(cache).forEach(cache => {
        cache?.dropCache(recursive);
      });
    }
    _const.requestCache[this.cacheId] = Object.createDict();
    this.async.terminateWorker({
      group: 'extraProvidersCache'
    });
    this.emitter.emit('dropCache', recursive);
  }
  destroy() {
    const cache = _const.requestCache[this.cacheId];
    if (cache != null) {
      Object.values(cache).forEach(cache => {
        cache?.destroy();
      });
    }
    this.async.clearAll().locked = true;
    this.emitter.removeAllListeners();
    delete _const.instanceCache[this.cacheId];
    delete _const.connectCache[this.cacheId];
    delete _const.requestCache[this.cacheId];
    Object.keys(this.params).forEach((key, _, data) => {
      delete data[key];
    });
    this.emitter.emit('destroy');
  }
  get(query, opts) {
    const url = this.resolveURL(this.baseGetURL),
      alias = this.alias ?? this.providerName;
    const eventName = this.name(),
      method = this.method() ?? this.getMethod;
    const mergedOpts = this.getRequestOptions('get', {
      ...opts,
      [_const.queryMethods[method] != null ? 'query' : 'body']: query,
      method
    });
    const req = this.request(url, this.resolver.bind(this), mergedOpts),
      res = eventName != null ? this.updateRequest(url, eventName, req) : this.updateRequest(url, req);
    const extraProviders = Object.isFunction(this.extraProviders) ? this.extraProviders({
      opts: Object.cast(mergedOpts),
      globalOpts: _request.globalOpts
    }) : this.extraProviders;
    if (extraProviders) {
      const composition = {},
        tasks = [],
        cloneTasks = [];
      for (let keys = Object.keys(extraProviders), i = 0; i < keys.length; i++) {
        const key = keys[i],
          el = extraProviders[key] ?? {};
        const ProviderLink = el.provider ?? key,
          alias = el.alias ?? key;
        let ProviderConstructor, providerInstance;
        if (Object.isString(ProviderLink)) {
          ProviderConstructor = _const.providers[ProviderLink];
          if (ProviderConstructor == null) {
            throw new Error(`Provider "${ProviderLink}" is not defined`);
          }
          providerInstance = new ProviderConstructor({
            ...this.params,
            ...el.providerOptions
          });
        } else if (Object.isSimpleFunction(ProviderLink)) {
          providerInstance = new ProviderLink({
            ...this.params,
            ...el.providerOptions
          });
        } else {
          providerInstance = ProviderLink;
        }
        this.async.worker(() => {
          providerInstance.dropCache(true);
        }, {
          group: 'extraProvidersCache'
        });
        this.async.worker(() => {
          providerInstance.destroy();
        });
        const req = providerInstance.get(el.query ?? query, el.request);
        tasks.push(req.then(async res => {
          const data = await res.data;
          Object.set(composition, alias, data);
          cloneTasks.push(composition => Object.set(composition, alias, data?.valueOf()));
          return res;
        }));
      }
      const compositionRes = res.then(res => Promise.all(tasks).then(async () => {
        const data = await res.data;
        Object.set(composition, alias, data);
        cloneTasks.push(composition => Object.set(composition, alias, data?.valueOf()));
        Object.defineProperty(composition, 'valueOf', {
          writable: true,
          configurable: true,
          value: () => {
            const clone = {};
            for (let i = 0; i < cloneTasks.length; i++) {
              cloneTasks[i](clone);
            }
            return clone;
          }
        });
        res.data = Promise.resolve((0, _proxyReadonly.readonly)(composition));
        return res;
      }), null, () => {
        for (let i = 0; i < tasks.length; i++) {
          tasks[i].abort();
        }
      });
      compositionRes['emitter'] = new _eventemitter.EventEmitter2();
      void Object.defineProperty(compositionRes, 'data', {
        configurable: true,
        enumerable: true,
        get: () => compositionRes.then(res => res.data)
      });
      const unimplementedStream = _implementation.unimplement.bind(null, {
        name: 'Symbol.asyncIterator',
        type: 'property',
        notice: "Requests with extra providers can't be streamed"
      });
      void Object.defineProperty(compositionRes, 'stream', {
        configurable: true,
        enumerable: true,
        get: unimplementedStream
      });
      compositionRes[Symbol.asyncIterator] = unimplementedStream;
      return Object.cast(compositionRes);
    }
    return res;
  }
  peek(query, opts) {
    const url = this.resolveURL(this.basePeekURL),
      method = this.method() ?? this.peekMethod,
      eventName = this.name();
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('peek', {
      ...opts,
      [_const.queryMethods[method] != null ? 'query' : 'body']: query,
      method
    }));
    if (eventName != null) {
      return this.updateRequest(url, eventName, req);
    }
    return this.updateRequest(url, req);
  }
  post(body, opts) {
    const url = this.resolveURL(),
      method = this.method() ?? 'POST',
      eventName = this.name();
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions(eventName ?? 'post', {
      ...opts,
      body,
      method
    }));
    if (eventName != null) {
      return this.updateRequest(url, eventName, req);
    }
    return this.updateRequest(url, req);
  }
  add(body, opts) {
    const url = this.resolveURL(this.baseAddURL),
      method = this.method() ?? this.addMethod,
      eventName = this.name() ?? 'add';
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('add', {
      ...opts,
      body,
      method
    }));
    return this.updateRequest(url, eventName, req);
  }
  update(body, opts) {
    const url = this.resolveURL(this.baseUpdateURL),
      method = this.method() ?? this.updateMethod,
      eventName = this.name() ?? 'update';
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('update', {
      ...opts,
      body,
      method
    }));
    return this.updateRequest(url, eventName, req);
  }
  delete(body, opts) {
    const url = this.resolveURL(this.baseDeleteURL),
      method = this.method() ?? this.deleteMethod,
      eventName = this.name() ?? 'delete';
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('delete', {
      ...opts,
      body,
      method
    }));
    return this.updateRequest(url, eventName, req);
  }
  resolveURL(baseURL, advURL) {
    return (0, _url.concatURLs)(baseURL == null ? this.baseURL : baseURL, advURL == null ? this.advURL : advURL);
  }
  setReadonlyParam(key, val) {
    Object.defineProperty(this, key, {
      configurable: true,
      get: () => val,
      set: () => {}
    });
  }
  getEventKey(event, data) {
    if (Object.isArray(data) || Object.isDictionary(data)) {
      return `${event}::${Object.fastHash(data)}`;
    }
    return {};
  }
  getRequestOptions(method, params) {
    const {
      middlewares,
      encoders,
      decoders
    } = this.constructor;
    const merge = (a, b) => {
      a = Object.isFunction(a) ? [a] : a;
      b = Object.isFunction(b) ? [b] : b;
      return {
        ...a,
        ...b
      };
    };
    const mappedMiddlewares = merge(middlewares, params?.middlewares);
    for (let keys = Object.keys(mappedMiddlewares), i = 0; i < keys.length; i++) {
      const key = keys[i];
      mappedMiddlewares[key] = mappedMiddlewares[key].bind(this);
    }
    return {
      ...params,
      cacheId: this.cacheId,
      middlewares: mappedMiddlewares,
      encoder: merge(encoders[method] ?? encoders['def'], params?.encoder),
      decoder: merge(decoders[method] ?? decoders['def'], params?.decoder),
      meta: {
        ...params?.meta,
        provider: this,
        providerMethod: method,
        providerParams: params
      }
    };
  }
  updateRequest(url, eventOrFactory, factory) {
    let event;
    if (Object.isFunction(eventOrFactory)) {
      factory = eventOrFactory;
    } else {
      event = eventOrFactory;
    }
    if (factory == null) {
      throw new ReferenceError('A factory function to create the requests is not specified');
    }
    const req = factory();
    req.then(res => {
      try {
        const cache = _const.requestCache[this.cacheId];
        const {
          ctx: {
            canCache,
            cacheKey
          }
        } = res;
        if (canCache && cacheKey != null && cache != null) {
          cache[cacheKey] = Object.cast(res);
        }
      } catch (err) {
        stderr(err);
      }
      if (event != null) {
        this.emitter.emit(event, () => res.data);
      }
    }).catch(() => {});
    return req;
  }
  initSocketBehaviour() {
    return Promise.resolve();
  }
}
exports.default = Provider;