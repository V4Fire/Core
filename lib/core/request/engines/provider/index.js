"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = createProviderEngine;
var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));
var _url = require("../../../../core/url");
var _data = _interopRequireWildcard(require("../../../../core/data"));
var _response = _interopRequireDefault(require("../../../../core/request/response"));
var _const = require("../../../../core/request/engines/provider/const");
Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});
var _composition = require("../../../../core/request/engines/composition");
Object.keys(_composition).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _composition[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _composition[key];
    }
  });
});
var _interface = require("../../../../core/request/engines/provider/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function createProviderEngine(src, methodsMapping = {}) {
  dataProviderEngine.pendingCache = false;
  return dataProviderEngine;
  function dataProviderEngine(params) {
    const p = Object.cast(Object.select(params, _const.availableParams)),
      provider = getProviderInstance(src, p.meta);
    Object.defineProperty(dataProviderEngine, 'dropCache', {
      configurable: true,
      enumerable: true,
      writable: true,
      value(recursive) {
        provider.dropCache(recursive);
      }
    });
    Object.defineProperty(dataProviderEngine, 'destroy', {
      configurable: true,
      enumerable: true,
      writable: true,
      value() {
        provider.destroy();
        delete dataProviderEngine['destroy'];
        delete dataProviderEngine['dropCache'];
      }
    });
    const defaultRequestMethods = _data.methodProperties.reduceRight((carry, key) => {
      const method = provider[key];
      if (Object.isTruly(method)) {
        carry[method] = key.replace('Method', '');
      }
      return carry;
    }, {});
    methodsMapping = {
      ...defaultRequestMethods,
      ...methodsMapping
    };
    const requestPromise = new _abortable.default(async (resolve, reject, onAbort) => {
      await new Promise(r => {
        setImmediate(r);
      });
      p.parent = requestPromise;
      let {
        providerMethod
      } = p.meta;
      const isSimpleRequest = providerMethod === undefined,
        getProviderMethod = key => key in methodsMapping ? methodsMapping[key] : key;
      providerMethod = getProviderMethod(isSimpleRequest ? p.method : providerMethod);
      if (providerMethod == null || !Object.isFunction(provider[providerMethod])) {
        throw new ReferenceError(`The passed provider method "${providerMethod}" is not found at the data provider instance`);
      }
      const requestMethod = provider[`${providerMethod}Method`] ?? 'post';
      let body = _data.queryMethods[requestMethod] != null ? p.query : p.body,
        urlProp = `base-${providerMethod}-URL`.camelize(false);
      if (!Object.isTruly(provider[urlProp])) {
        urlProp = _data.urlProperties[0];
      }
      const providerToRequest = isSimpleRequest ? createMixedProvider(provider, {
        [urlProp]: p.url.replace(_data.globalOpts.api ?? '', '')
      }) : provider;
      if (Object.isDictionary(body)) {
        body = Object.mixin({
          withNonEnumerables: true
        }, {}, body);
      }
      const req = providerToRequest[providerMethod](body, p);
      onAbort(reason => {
        req.abort(reason);
      });
      const registeredEvents = Object.createDict();
      params.emitter.on('newListener', event => {
        if (registeredEvents[event]) {
          return;
        }
        registeredEvents[event] = true;
        req.emitter.on(event, e => params.emitter.emit(event, e));
      });
      params.emitter.emit('drainListeners');
      const providerResObj = await req,
        providerResponse = providerResObj.response;
      const getResponse = () => providerResObj.data;
      getResponse[Symbol.asyncIterator] = () => {
        const type = providerResponse.sourceResponseType;
        if (!(`${type}Stream` in providerResponse)) {
          return providerResponse[Symbol.asyncIterator]();
        }
        const stream = providerResponse.decodeStream();
        return {
          [Symbol.asyncIterator]() {
            return this;
          },
          async next() {
            const {
              done,
              value
            } = await stream.next();
            return {
              done,
              value: {
                data: value
              }
            };
          }
        };
      };
      return resolve(new _response.default(getResponse, {
        url: providerResponse.url,
        redirected: providerResponse.redirected,
        parent: params.parent,
        important: providerResponse.important,
        okStatuses: providerResponse.okStatuses,
        noContentStatuses: providerResponse.noContentStatuses,
        status: providerResponse.status,
        statusText: providerResponse.statusText,
        headers: providerResponse.headers,
        responseType: 'object',
        forceResponseType: true,
        decoder: params.decoders,
        streamDecoder: params.streamDecoders,
        jsonReviver: params.jsonReviver
      }));
    }, params.parent);
    return requestPromise;
  }
}
function getProviderInstance(src, meta) {
  if (Object.isString(src)) {
    const provider = _data.providers[src];
    if (provider == null) {
      throw new ReferenceError(`A provider "${src}" is not registered`);
    }
    src = provider;
  }
  let provider;
  if (src instanceof _data.default) {
    provider = src;
  } else {
    provider = new src(Object.reject(meta?.provider?.params, _const.deniedProviderParams));
  }
  if (meta?.provider != null) {
    return createMixedProvider(provider, Object.cast(meta.provider));
  }
  return provider;
}
function createMixedProvider(base, modifier = {}) {
  const mixedProvider = Object.create(base);
  _data.urlProperties.forEach(key => {
    if (base[key] == null && modifier[key] == null) {
      mixedProvider[key] = undefined;
    } else {
      mixedProvider[key] = (0, _url.concatURLs)(base[key], modifier[key]);
    }
  });
  return mixedProvider;
}