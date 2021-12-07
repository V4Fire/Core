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

var _log = _interopRequireDefault(require("../../core/log"));

var _abortable = _interopRequireDefault(require("../../core/promise/abortable"));

var _net = require("../../core/net");

var _response = _interopRequireDefault(require("../../core/request/response"));

var _error = _interopRequireDefault(require("../../core/request/error"));

var _context = _interopRequireDefault(require("../../core/request/context"));

var _utils = require("../../core/request/utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _utils[key];
    }
  });
});

var _const = require("../../core/request/const");

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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/README.md]]
 * @packageDocumentation
 */
var _default = request;
/**
 * Creates a new remote request with the specified options
 *
 * @param path - request path URL
 * @param opts - request options
 *
 * @example
 * ```js
 * request('bla/get').then(({data, response}) => {
 *   console.log(data, response.status);
 * });
 * ```
 */

exports.default = _default;

function request(path, ...args) {
  if (Object.isPlainObject(path)) {
    const defOpts = path;
    return (path, resolver, opts) => {
      if (Object.isPlainObject(path)) {
        return request((0, _utils.merge)(defOpts, path));
      }

      if (Object.isFunction(resolver)) {
        return request(path, resolver, (0, _utils.merge)(defOpts, opts));
      }

      return request(path, (0, _utils.merge)(defOpts, resolver));
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
  const baseCtx = new _context.default((0, _utils.merge)(_const.defaultRequestOpts, opts));

  const run = (...args) => {
    const ctx = _context.default.decorateContext(baseCtx, path, resolver, ...args),
          requestParams = ctx.params;

    const middlewareParams = {
      opts: requestParams,
      ctx,
      globalOpts: _const.globalOpts
    };
    const parent = new _abortable.default(async (resolve, reject, onAbort) => {
      const errDetails = {
        request: requestParams
      };
      onAbort(err => {
        reject(err ?? new _error.default(_error.default.Abort, errDetails));
      });
      await new Promise(setImmediate);
      ctx.parent = parent;

      if (Object.isPromise(ctx.cache)) {
        await _abortable.default.resolve(ctx.isReady, parent);
      }

      const tasks = [];
      Object.forEach(requestParams.middlewares, fn => {
        tasks.push(fn(middlewareParams));
      });
      const middlewareResults = await _abortable.default.all(tasks, parent),
            keyToEncode = ctx.withoutBody ? 'query' : 'body'; // eslint-disable-next-line require-atomic-updates

      requestParams[keyToEncode] = Object.cast(await applyEncoders(requestParams[keyToEncode]));

      for (let i = 0; i < middlewareResults.length; i++) {
        // If the middleware returns a function, the function will be executed.
        // The result of invoking is provided as the result of the whole request.
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

      const url = ctx.resolveRequest(_const.globalOpts.api);
      const {
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
            const isRequestCanceled = {
              clearAsync: true,
              abort: true
            }[err?.type] === true;

            if (isRequestCanceled) {
              reject(err);
              return;
            }
          }
        }

        fromCache = await _abortable.default.resolve(ctx.cache.has(cacheKey), parent);
      }

      let res,
          cache = 'none';

      if (fromCache) {
        const getFromCache = async () => {
          cache = (await _abortable.default.resolve((0, _net.isOnline)(), parent)).status ? 'memory' : 'offline';
          return ctx.cache.get(cacheKey);
        };

        res = _abortable.default.resolveAndCall(getFromCache, parent).then(ctx.wrapAsResponse.bind(ctx)).then(res => Object.assign(res, {
          cache
        }));
      } else {
        const reqOpts = { ...requestParams,
          url,
          parent,
          decoders: ctx.decoders
        };

        const createReq = () => requestParams.engine(reqOpts);

        if (requestParams.retry != null) {
          const retryParams = Object.isNumber(requestParams.retry) ? {
            attempts: requestParams.retry
          } : requestParams.retry;

          const attemptLimit = retryParams.attempts ?? Infinity,
                delayFn = retryParams.delay?.bind(retryParams) ?? (i => i < 5 ? i * 500 : 5 .seconds());

          let attempt = 0;

          const createReqWithRetrying = async () => {
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
              return await createReq().then(wrapSuccessResponse);
            } catch (err) {
              if (attempt++ >= attemptLimit) {
                throw err;
              }

              const delay = await calculateDelay(attempt, err);

              if (delay === false) {
                throw err;
              }

              return createReqWithRetrying();
            }
          };

          res = createReqWithRetrying();
        } else {
          res = createReq().then(wrapSuccessResponse);
        }
      }

      res = res.then(ctx.saveCache.bind(ctx));
      res.then(response => (0, _log.default)(`request:response:${path}`, response.data, {
        cache,
        request: requestParams
      })).catch(err => _log.default.error('request', err));
      resolve(ctx.wrapRequest(res));

      function applyEncoders(data) {
        let res = _abortable.default.resolve(data, parent);

        Object.forEach(ctx.encoders, (fn, i) => {
          res = res.then(obj => fn(i > 0 ? obj : Object.fastClone(obj)));
        });
        return res;
      }

      async function wrapSuccessResponse(response) {
        const details = {
          response,
          ...errDetails
        };

        if (!response.ok) {
          throw _abortable.default.wrapReasonToIgnore(new _error.default(_error.default.InvalidStatus, details));
        }

        const data = await response.decode();
        return {
          data,
          response,
          ctx,
          dropCache: ctx.dropCache.bind(ctx)
        };
      }
    });
    return parent;
  };

  if (Object.isFunction(resolver)) {
    return run;
  }

  return run();
}