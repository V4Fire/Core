"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  providerCompositionEngine: true
};
exports.providerCompositionEngine = providerCompositionEngine;
var _data = _interopRequireDefault(require("../../../../../core/data"));
var _abortable = _interopRequireDefault(require("../../../../../core/promise/abortable"));
var _request = require("../../../../../core/request");
var _interface = require("../../../../../core/request/engines/provider/composition/interface");
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
function providerCompositionEngine(providers) {
  const boundedProviders = new Set();
  return (options, params) => new _abortable.default((resolve, reject) => {
    const results = {},
      promises = [];
    const self = params.opts.meta.provider,
      selfOptions = self instanceof _data.default ? self.params : undefined;
    if (self instanceof _data.default) {
      wrapSelf(self);
    }
    for (const provider of providers) {
      const requestFilter = provider.requestFilter?.(options, params, self?.params);
      if (requestFilter === false) {
        continue;
      } else if (Object.isPromise(requestFilter)) {
        const promise = requestFilter.then(value => {
          if (value === false) {
            return;
          }
          return createRequest(provider);
        });
        promises.push(promise);
      } else {
        promises.push(createRequest(provider));
      }
    }
    Promise.all(promises).then(() => {
      const response = new _request.Response(results, {
        parent: options.parent,
        important: options.important,
        responseType: 'json',
        okStatuses: options.okStatuses,
        status: Object.cast(200),
        decoder: options.decoders
      });
      resolve(response);
    }, reject);
    function boundProvider(provider) {
      boundedProviders.add(provider);
      return provider;
    }
    function wrapSelf(provider) {
      const originalDestroy = provider.destroy.bind(provider),
        originalDropCache = provider.dropCache.bind(provider);
      provider.destroy = (...args) => {
        boundedProviders.forEach(provider => provider.destroy(...args));
        boundedProviders.clear();
        originalDestroy(...args);
      };
      provider.dropCache = (...args) => {
        boundedProviders.forEach(provider => provider.dropCache(...args));
        originalDropCache(...args);
      };
      return provider;
    }
    function createRequest(composedProvider) {
      const promise = composedProvider.request(options, params, {
        providerWrapper: boundProvider,
        providerOptions: selfOptions
      }).then(async result => {
        const data = await result.data;
        results[composedProvider.as] = data;
      }).catch(err => {
        if (composedProvider.failCompositionOnError) {
          throw err;
        }
      });
      return promise;
    }
  });
}