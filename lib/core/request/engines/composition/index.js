"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  compositionEngine: true
};
exports.compositionEngine = compositionEngine;
var _async = _interopRequireDefault(require("../../../../core/async"));
var _statusCodes = _interopRequireDefault(require("../../../../core/status-codes"));
var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));
var _structures = require("../../../../core/prelude/structures");
var _request = require("../../../../core/request");
var _const = require("../../../../core/request/engines/composition/const");
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
function compositionEngine(compositionRequests, engineOptions) {
  const async = new _async.default();
  const engine = (requestOptions, params) => {
    const options = {
      boundRequest: boundRequest.bind(null, async),
      options: requestOptions,
      params,
      providerOptions: requestOptions.meta?.provider?.params,
      engineOptions,
      compositionRequests
    };
    return new _abortable.default((resolve, reject) => {
      const {
        provider
      } = params.opts.meta;
      if (provider) {
        async.on(provider.emitter, 'dropCache', recursive => {
          engine.dropCache(recursive);
        }, {
          label: 'dropCacheListener'
        });
        async.on(provider.emitter, 'destroy', () => {
          engine.destroy();
        }, {
          label: 'destroyListener'
        });
      }
      const promises = compositionRequests.map(r => _structures.SyncPromise.resolve(r.requestFilter?.(options)).then(filterValue => {
        if (filterValue === false) {
          return;
        }
        return r.request(options).then(boundRequest.bind(null, async)).then(request => isRequestResponseObject(request) ? request.data : request).catch(err => {
          if (r.failCompositionOnError) {
            throw err;
          }
        });
      }));
      gatherDataFromRequests(promises, options).then(data => {
        resolve(new _request.Response(data, {
          parent: requestOptions.parent,
          important: requestOptions.important,
          responseType: 'object',
          okStatuses: requestOptions.okStatuses,
          status: _statusCodes.default.OK,
          decoder: requestOptions.decoders,
          noContentStatuses: requestOptions.noContentStatuses
        }));
      }).catch(reject);
    });
  };
  engine.dropCache = () => async.clearAll({
    group: 'cache'
  });
  engine.destroy = () => async.clearAll();
  return engine;
}
function boundRequest(async, requestObject) {
  if (isDestroyableObject(requestObject)) {
    const provider = tryGetProvider(requestObject);
    if (requestObject.dropCache != null) {
      async.worker(() => {
        provider?.dropCache(true);
        requestObject.dropCache?.(true);
      }, {
        group: 'cache'
      });
    }
    if (requestObject.destroy != null) {
      async.worker(() => {
        provider?.destroy();
        requestObject.destroy?.();
      });
    }
  }
  return requestObject;
}
async function gatherDataFromRequests(promises, options) {
  const accumulator = {};
  if (options.engineOptions?.aggregateErrors) {
    await Promise.allSettled(promises).then(results => {
      const errors = [];
      results.forEach((res, index) => {
        const {
          failCompositionOnError
        } = options.compositionRequests[index];
        if (res.status === 'rejected' && failCompositionOnError) {
          errors.push(res.reason);
        }
        if (res.status === 'fulfilled') {
          accumulateData(accumulator, res.value, options.compositionRequests[index]);
        }
      });
      if (errors.length > 0) {
        throw new AggregateError(errors);
      }
    });
  } else {
    const results = await Promise.all(promises);
    results.forEach((value, index) => accumulateData(accumulator, value, options.compositionRequests[index]));
  }
  return accumulator;
}
function accumulateData(accumulator, data, compositionRequest) {
  const {
    as
  } = compositionRequest;
  if (as === _const.compositionEngineSpreadResult) {
    Object.assign(accumulator, data);
  } else {
    Object.set(accumulator, as, data);
  }
  return accumulator;
}
function isDestroyableObject(something) {
  return Object.isPlainObject(something) && ('dropCache' in something || 'destroy' in something);
}
function isRequestResponseObject(something) {
  return isDestroyableObject(something) && 'data' in something && 'response' in something;
}
function tryGetProvider(from) {
  return Object.isPlainObject(from) && Object.get(from, 'ctx.params.meta.provider') || undefined;
}