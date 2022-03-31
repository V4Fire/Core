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

var _params = _interopRequireWildcard(require("../../../core/data/modules/params"));

Object.keys(_params).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _params[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _params[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const $$ = (0, _symbol.default)();
exports.$$ = $$;

class Provider extends _params.default {
  /**
   * Cache identifier
   */

  /** @inheritDoc */

  /** @inheritDoc */

  /** @inheritDoc */
  get providerName() {
    return this.constructor[_const.namespace];
  }
  /** @inheritDoc */


  get event() {
    (0, _functools.deprecate)({
      name: 'event',
      type: 'accessor',
      renamedTo: 'emitter'
    });
    return this.emitter;
  }
  /**
   * API for async operations
   */


  /**
   * @param [opts] - additional options
   */
  constructor(opts = {}) {
    super();
    const id = this.getCacheKey(opts),
          cacheVal = _const.instanceCache[id];

    if (cacheVal != null) {
      return cacheVal;
    }

    _const.instanceCache[id] = this;
    _const.requestCache[id] = Object.createDict();
    this.cacheId = id;
    this.async = new _async.default(this);
    this.emitter = new _eventemitter.EventEmitter2({
      maxListeners: 1e3,
      newListener: false
    });

    if (opts.socket || this.socketURL != null) {
      this.connect().then(this.initSocketBehaviour.bind(this), stderr);
    }
  }
  /**
   * Returns a key to the class instance cache
   * @param [paramsForCache]
   */


  getCacheKey(paramsForCache = {}) {
    return `${this.providerName}:${Object.fastHash(paramsForCache)}`;
  }
  /**
   * Returns an object with authentication parameters
   * @param params - additional parameters
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental


  getAuthParams(params) {
    return Promise.resolve({});
  }
  /**
   * Function to resolve a request: it takes a request URL and request environment
   * and can modify some request parameters.
   *
   * Also, if the function returns a new string, the string will be appended to the request URL, or
   * if the function returns a string that wrapped with an array, the string fully override the original URL.
   *
   * @see [[RequestResolver]]
   * @param url - request URL
   * @param params - request parameters
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental


  resolver(url, params) {
    return undefined;
  }
  /**
   * Connects to a socket server and returns the connection
   * @param [opts] - additional options for the server
   */


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
  /** @inheritDoc */


  name(value) {
    if (value == null) {
      return this.eventName;
    }

    const obj = Object.create(this);
    obj.eventName = value;
    return obj;
  }
  /** @inheritDoc */


  method(value) {
    if (value == null) {
      return this.customMethod;
    }

    const obj = Object.create(this);
    obj.customMethod = value;
    return obj;
  }
  /** @inheritDoc */


  base(value) {
    if (value == null) {
      return this.baseURL;
    }

    const obj = Object.create(this);
    obj.baseURL = value;
    obj.baseGetURL = undefined;
    obj.basePeekURL = undefined;
    obj.baseAddURL = undefined;
    obj.baseUpdURL = undefined;
    obj.baseDelURL = undefined;
    return obj;
  }
  /** @inheritDoc */


  url(value) {
    if (value == null) {
      return (0, _url.concatURLs)(this.baseURL, this.advURL);
    }

    const obj = Object.create(this);
    obj.advURL = value;
    return obj;
  }
  /** @inheritDoc */


  dropCache() {
    const cache = _const.requestCache[this.cacheId];

    if (cache) {
      for (let keys = Object.keys(cache), i = 0; i < keys.length; i++) {
        const obj = cache[keys[i]];

        if (obj) {
          obj.dropCache();
        }
      }
    }

    _const.requestCache[this.cacheId] = Object.createDict();
  }
  /** @inheritDoc */


  get(query, opts) {
    const url = this.resolveURL(this.baseGetURL),
          alias = this.alias ?? this.providerName;
    const eventName = this.name(),
          method = this.method() ?? this.getMethod;
    const mergedOpts = this.getRequestOptions('get', { ...opts,
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

          providerInstance = new ProviderConstructor(el.providerOptions);
        } else if (Object.isSimpleFunction(ProviderLink)) {
          providerInstance = new ProviderLink(el.providerOptions);
        } else {
          providerInstance = ProviderLink;
        }

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
        }); // eslint-disable-next-line require-atomic-updates

        res.data = Promise.resolve((0, _proxyReadonly.readonly)(composition));
        return res;
      }), null, () => {
        for (let i = 0; i < tasks.length; i++) {
          tasks[i].abort();
        }
      });
      Object.defineProperty(compositionRes, 'data', {
        configurable: true,
        get: () => compositionRes.then(res => res.data)
      });

      compositionRes[Symbol.asyncIterator] = () => {
        (0, _implementation.unimplement)({
          name: 'Symbol.asyncIterator',
          type: 'property',
          notice: "Requests with extra providers can't be streamed"
        });
      };

      return compositionRes;
    }

    return res;
  }
  /** @inheritDoc */


  peek(query, opts) {
    const url = this.resolveURL(this.basePeekURL),
          eventName = this.name(),
          method = this.method() ?? this.peekMethod;
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('peek', { ...opts,
      [_const.queryMethods[method] != null ? 'query' : 'body']: query,
      method
    }));

    if (eventName != null) {
      return this.updateRequest(url, eventName, req);
    }

    return this.updateRequest(url, req);
  }
  /** @inheritDoc */


  post(body, opts) {
    const url = this.resolveURL(),
          eventName = this.name(),
          method = this.method() ?? 'POST';
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions(eventName ?? 'post', { ...opts,
      body,
      method
    }));

    if (eventName != null) {
      return this.updateRequest(url, eventName, req);
    }

    return this.updateRequest(url, req);
  }
  /** @inheritDoc */


  add(body, opts) {
    const url = this.resolveURL(this.baseAddURL),
          eventName = this.name() ?? 'add',
          method = this.method() ?? this.addMethod;
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('add', { ...opts,
      body,
      method
    }));
    return this.updateRequest(url, eventName, req);
  }
  /**
   * @alias
   * @see [[Provider.upd]]
   */


  update(body, opts) {
    return this.upd(body, opts);
  }
  /** @inheritDoc */


  upd(body, opts) {
    const url = this.resolveURL(this.baseUpdURL),
          eventName = this.name() ?? 'upd',
          method = this.method() ?? this.updMethod;
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('upd', { ...opts,
      body,
      method
    }));
    return this.updateRequest(url, eventName, req);
  }
  /**
   * @alias
   * @see [[Provider.del]]
   */


  delete(body, opts) {
    return this.del(body, opts);
  }
  /** @inheritDoc */


  del(body, opts) {
    const url = this.resolveURL(this.baseDelURL),
          eventName = this.name() ?? 'del',
          method = this.method() ?? this.delMethod;
    const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('del', { ...opts,
      body,
      method
    }));
    return this.updateRequest(url, eventName, req);
  }
  /**
   * Returns full request URL by the specified URL chunks
   *
   * @param [baseURL]
   * @param [advURL]
   */


  resolveURL(baseURL, advURL) {
    return (0, _url.concatURLs)(baseURL == null ? this.baseURL : baseURL, advURL == null ? this.advURL : advURL);
  }
  /**
   * Sets a readonly value by the specified key to the current provider
   */


  setReadonlyParam(key, val) {
    Object.defineProperty(this, key, {
      configurable: true,
      get: () => val,
      set: () => {// Loopback
      }
    });
  }
  /**
   * Returns an event cache key by the specified parameters
   *
   * @param event - event name
   * @param data - event data
   */


  getEventKey(event, data) {
    if (Object.isArray(data) || Object.isDictionary(data)) {
      return `${event}::${Object.fastHash(data)}`;
    }

    return {};
  }
  /**
   * Returns an object with request options by the specified model name and object with additional parameters
   *
   * @param method - model method
   * @param [params] - additional parameters
   */


  getRequestOptions(method, params) {
    const {
      middlewares,
      encoders,
      decoders
    } = this.constructor;

    const merge = (a, b) => {
      a = Object.isFunction(a) ? [a] : a;
      b = Object.isFunction(b) ? [b] : b;
      return { ...a,
        ...b
      };
    };

    const mappedMiddlewares = merge(middlewares, params?.middlewares);

    for (let keys = Object.keys(mappedMiddlewares), i = 0; i < keys.length; i++) {
      const key = keys[i];
      mappedMiddlewares[key] = mappedMiddlewares[key].bind(this);
    }

    return { ...params,
      cacheId: this.cacheId,
      middlewares: mappedMiddlewares,
      encoder: merge(encoders[method] ?? encoders['def'], params?.encoder),
      decoder: merge(decoders[method] ?? decoders['def'], params?.decoder),
      meta: {
        provider: this,
        providerMethod: method,
        providerParams: params
      }
    };
  }
  /**
   * Updates the specified request with adding caching, etc.
   *
   * @param url - request url
   * @param factory - request factory
   */


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
    }).catch(() => {// Do nothing. Logging is already handled in the request factory.
    });
    return req;
  }
  /**
   * Initializes the socket behaviour after successful connecting
   */


  initSocketBehaviour() {
    return Promise.resolve();
  }

}

exports.default = Provider;