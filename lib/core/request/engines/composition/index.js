"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  compositionEngine: true
};
exports.compositionEngine = compositionEngine;
var _data = _interopRequireDefault(require("../../../../core/data"));
var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));
var _request = require("../../../../core/request");
var _interface = require("../../../../core/request/engines/composition/interface");
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
function compositionEngine(requests, opts) {
  const boundedProviders = new Set(),
    boundedRequests = new Map();
  const engine = (options, params) => new _abortable.default((resolve, reject) => {
    const result = {},
      promises = [];
    for (const provider of requests) {
      const requestFilter = provider.requestFilter?.(options, params);
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
    const resultPromise = (() => {
      if (opts?.aggregateErrors) {
        return Promise.allSettled(promises).then(results => {
          const errors = [];
          results.forEach((res, index) => {
            const {
              failCompositionOnError
            } = requests[index];
            if (res.status === 'rejected' && failCompositionOnError) {
              errors.push(res.reason);
            }
          });
          if (errors.length > 0) {
            throw new AggregateError(errors);
          }
        });
      }
      return Promise.all(promises);
    })();
    resultPromise.then(() => {
      const response = new _request.Response(result, {
        parent: options.parent,
        important: options.important,
        responseType: 'json',
        okStatuses: options.okStatuses,
        status: Object.cast(200),
        decoder: options.decoders
      });
      resolve(response);
    }, reject);
    const context = params.opts.meta.provider ?? params.ctx,
      providerParams = context instanceof _data.default ? context.params : undefined;
    function boundRequest(request) {
      if (request instanceof _data.default) {
        boundedProviders.add(request);
        const forkedDestroy = request.destroy.bind(request);
        request.destroy = (...args) => {
          boundedProviders.delete(request);
          forkedDestroy(...args);
        };
        return request;
      }
      const wrapRequestResponseObject = r => {
        const {
          cacheKey
        } = r.ctx;
        if (cacheKey != null && !r.destroyed) {
          boundedRequests.set(cacheKey, r);
          const forkedDestroy = r.destroy;
          r.destroy = (...args) => {
            boundedRequests.delete(cacheKey);
            forkedDestroy(...args);
          };
        }
        return r;
      };
      if (Object.isPromise(request)) {
        return request.then(requestResponseObj => wrapRequestResponseObject(requestResponseObj));
      }
      return wrapRequestResponseObject(request);
    }
    function createRequest(composedProvider) {
      const promise = composedProvider.request(options, params, {
        boundRequest,
        providerOptions: providerParams
      }).then(async requestResponseObject => {
        const data = await requestResponseObject.data;
        result[composedProvider.as] = data;
      }).catch(err => {
        if (composedProvider.failCompositionOnError) {
          throw err;
        }
      });
      return promise;
    }
  });
  engine.dropCache = recursive => {
    boundedRequests.forEach(request => request.dropCache(recursive));
    boundedProviders.forEach(request => request.dropCache(recursive));
  };
  engine.destroy = () => {
    boundedRequests.forEach(request => request.destroy());
    boundedProviders.forEach(request => request.destroy());
    boundedRequests.clear();
    boundedProviders.clear();
  };
  engine.boundedRequests = boundedRequests;
  engine.boundedProviders = boundedProviders;
  return engine;
}