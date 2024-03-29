"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Response: true,
  RequestError: true,
  globalOpts: true,
  cache: true,
  pendingCache: true
};
Object.defineProperty(exports, "RequestError", {
  enumerable: true,
  get: function () {
    return _error.default;
  }
});
Object.defineProperty(exports, "Response", {
  enumerable: true,
  get: function () {
    return _response.default;
  }
});
Object.defineProperty(exports, "cache", {
  enumerable: true,
  get: function () {
    return _const.cache;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "globalOpts", {
  enumerable: true,
  get: function () {
    return _const.globalOpts;
  }
});
Object.defineProperty(exports, "pendingCache", {
  enumerable: true,
  get: function () {
    return _const.pendingCache;
  }
});
var _eventemitter = require("eventemitter2");
var _log = _interopRequireDefault(require("../../core/log"));
var _sync = _interopRequireDefault(require("../../core/promise/sync"));
var _abortable = _interopRequireDefault(require("../../core/promise/abortable"));
var _net = require("../../core/net");
var _promise = require("../../core/promise");
var _response = _interopRequireDefault(require("../../core/request/response"));
var _error = _interopRequireDefault(require("../../core/request/error"));
var _helpers = require("../../core/request/helpers");
Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});
var _const = require("../../core/request/const");
var _context = _interopRequireDefault(require("../../core/request/modules/context"));
var _interface = require("../../core/request/interface");
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
var _interface2 = require("../../core/request/response/interface");
Object.keys(_interface2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface2[key];
    }
  });
});
var _default = request;
exports.default = _default;
function request(path, ...args) {
  if (Object.isPlainObject(path)) {
    const defOpts = path;
    return (path, resolver, opts) => {
      if (Object.isPlainObject(path)) {
        return request((0, _helpers.merge)(defOpts, path));
      }
      if (Object.isFunction(resolver)) {
        return request(path, resolver, (0, _helpers.merge)(defOpts, opts));
      }
      return request(path, (0, _helpers.merge)(defOpts, resolver));
    };
  }
  let resolver, opts;
  if (args.length > 1) {
    [resolver, opts] = Object.cast(args);
  } else if (Object.isDictionary(args[0])) {
    opts = args[0];
  } else if (Object.isFunction(args[0])) {
    resolver = args[0];
  }
  opts ??= {};
  const baseCtx = new _context.default((0, _helpers.merge)(_const.defaultRequestOpts, opts));
  const run = (...args) => {
    const emitter = new _eventemitter.EventEmitter2({
      maxListeners: 100,
      newListener: true,
      wildcard: true
    });
    const eventBuffer = new Set();
    emitter.on('newListener', event => {
      if (event !== 'newListener' && event !== 'drainListeners') {
        eventBuffer.add(event);
      }
    });
    emitter.on('drainListeners', () => {
      eventBuffer.forEach(event => emitter.emit('newListener', event));
      eventBuffer.clear();
    });
    let ctx = _context.default.decorateContext(baseCtx, path, resolver, ...args);
    const requestParams = ctx.params;
    const middlewareParams = {
      ctx,
      globalOpts: _const.globalOpts,
      opts: requestParams
    };
    const errDetails = {
      request: requestParams
    };
    const requestPromise = new _abortable.default(async (resolve, reject, onAbort) => {
      onAbort(err => {
        reject(err ?? new _error.default(_error.default.Abort, errDetails));
      });
      await Promise.resolve();
      ctx.parent = requestPromise;
      if (Object.isPromise(ctx.cache)) {
        await _abortable.default.resolve(ctx.isReady, requestPromise);
      }
      const middlewareTasks = [];
      Object.forEach(requestParams.middlewares, fn => {
        middlewareTasks.push(fn(middlewareParams));
      });
      const middlewareResults = await _abortable.default.all(middlewareTasks, requestPromise),
        paramsKeyToEncode = ctx.withoutBody ? 'query' : 'body';
      requestParams[paramsKeyToEncode] = Object.cast(await applyEncoders(requestParams[paramsKeyToEncode]));
      for (let i = 0; i < middlewareResults.length; i++) {
        if (!Object.isFunction(middlewareResults[i])) {
          continue;
        }
        resolve((() => {
          const res = [];
          for (let j = i; j < middlewareResults.length; j++) {
            const el = middlewareResults[j];
            if (Object.isFunction(el)) {
              res.push(el());
            }
          }
          if (res.length === 1) {
            return res[0];
          }
          return res;
        })());
        return;
      }
      const url = ctx.resolveRequest(_const.globalOpts.api),
        {
          cacheKey
        } = ctx;
      let fromCache = false;
      if (cacheKey != null && ctx.canCache) {
        if (ctx.pendingCache.has(cacheKey)) {
          try {
            const res = await ctx.pendingCache.get(cacheKey);
            if (res?.response instanceof _response.default) {
              resolve(res);
              return;
            }
          } catch (err) {
            const errType = err?.type;
            if (errType === 'clearAsync' || errType === 'abort') {
              reject(err);
              return;
            }
          }
        } else if (requestParams.engine.pendingCache !== false) {
          void ctx.pendingCache.set(cacheKey, Object.cast((0, _promise.createControllablePromise)({
            type: _abortable.default,
            args: [ctx.parent]
          })));
        }
        fromCache = await _abortable.default.resolve(ctx.cache.has(cacheKey), requestPromise);
      }
      let resultPromise,
        cache = 'none';
      if (fromCache) {
        const getFromCache = async () => {
          cache = (await _abortable.default.resolve((0, _net.isOnline)(), requestPromise)).status ? 'memory' : 'offline';
          return ctx.cache.get(cacheKey);
        };
        resultPromise = _abortable.default.resolveAndCall(getFromCache, requestPromise).then(ctx.wrapAsResponse.bind(ctx)).then(res => Object.assign(res, {
          cache
        }));
      } else {
        const reqOpts = {
          ...requestParams,
          url,
          emitter,
          parent: requestPromise,
          decoders: ctx.decoders,
          streamDecoders: ctx.streamDecoders
        };
        const createEngineRequest = () => {
          const {
            engine
          } = requestParams;
          const req = engine(reqOpts, Object.cast(middlewareParams));
          return req.catch(err => {
            if (err instanceof _error.default) {
              Object.assign(err.details, errDetails);
            }
            return Promise.reject(err);
          });
        };
        if (requestParams.retry != null) {
          const retryParams = Object.isNumber(requestParams.retry) ? {
            attempts: requestParams.retry
          } : requestParams.retry;
          const attemptLimit = retryParams.attempts ?? Infinity,
            delayFn = retryParams.delay?.bind(retryParams) ?? (i => i < 5 ? i * 500 : 5 .seconds());
          let attempt = 0;
          const createRequestWithRetrying = async () => {
            const calculateDelay = (attempt, err) => {
              const delay = delayFn(attempt, err);
              if (Object.isPromise(delay) || delay === false) {
                return delay;
              }
              return new Promise(r => {
                setTimeout(r, Object.isNumber(delay) ? delay : 1 .second());
              });
            };
            try {
              return await createEngineRequest().then(wrapSuccessResponse);
            } catch (err) {
              if (attempt++ >= attemptLimit) {
                throw err;
              }
              const delay = await calculateDelay(attempt, err);
              if (delay === false) {
                throw err;
              }
              return createRequestWithRetrying();
            }
          };
          resultPromise = createRequestWithRetrying();
        } else {
          resultPromise = createEngineRequest().then(wrapSuccessResponse);
        }
      }
      resultPromise.then(ctx.saveCache.bind(ctx)).then(async ({
        response,
        data
      }) => {
        if (response.bodyUsed === true) {
          (0, _log.default)(`request:response:${path}`, await data, {
            cache,
            request: requestParams
          });
        }
      }).catch(err => _log.default.error('request', err));
      resolve(ctx.wrapRequest(resultPromise));
      function applyEncoders(data) {
        let res = _abortable.default.resolve(data, requestPromise);
        Object.forEach(ctx.encoders, (fn, i) => {
          res = res.then(obj => fn(i > 0 ? obj : Object.fastClone(obj)));
        });
        return res;
      }
      function wrapSuccessResponse(response) {
        void responseIterator.resolve(response[Symbol.asyncIterator].bind(response));
        const details = {
          response,
          ...errDetails
        };
        if (!response.ok) {
          throw _abortable.default.wrapReasonToIgnore(new _error.default(_error.default.InvalidStatus, details));
        }
        let customData,
          destroyed = false;
        const res = {
          ctx,
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
          emitter,
          [Symbol.asyncIterator]: response[Symbol.asyncIterator].bind(response),
          dropCache: ctx.dropCache.bind(ctx),
          destroy: () => {
            if (destroyed) {
              return;
            }
            ctx.destroy();
            emitter.removeAllListeners();
            ctx = Object.cast(null);
            Object.set(res, 'ctx', ctx);
            response.destroy();
            response = Object.cast(null);
            Object.set(res, 'response', response);
            customData = undefined;
            Object.delete(res, 'data');
            Object.defineProperty(res, 'stream', {
              configurable: true,
              enumerable: true,
              get: () => Promise.resolve({
                done: true,
                value: undefined
              })
            });
            res.dropCache = () => undefined;
            res[Symbol.asyncIterator] = () => Promise.resolve({
              done: true,
              value: undefined
            });
            Object.keys(middlewareParams).forEach(key => {
              delete middlewareParams[key];
            });
            Object.keys(errDetails).forEach(key => {
              delete errDetails[key];
            });
            destroyed = true;
          }
        };
        return res;
      }
    });
    requestPromise['emitter'] = emitter;
    void Object.defineProperty(requestPromise, 'data', {
      configurable: true,
      enumerable: true,
      get: () => requestPromise.then(res => res.data)
    });
    void Object.defineProperty(requestPromise, 'stream', {
      configurable: true,
      enumerable: true,
      get: () => requestPromise.then(res => res.stream)
    });
    const responseIterator = (0, _promise.createControllablePromise)({
      type: _abortable.default,
      args: [ctx.parent]
    });
    requestPromise[Symbol.asyncIterator] = () => {
      const iter = responseIterator.then(iter => iter());
      return {
        [Symbol.asyncIterator]() {
          return this;
        },
        next() {
          return iter.then(iter => iter.next());
        }
      };
    };
    return requestPromise;
  };
  if (Object.isFunction(resolver)) {
    return run;
  }
  return run();
}