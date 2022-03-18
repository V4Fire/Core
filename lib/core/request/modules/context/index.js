"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _log = _interopRequireDefault(require("../../../../core/log"));

var _url = require("../../../../core/url");

var _mimeType = require("../../../../core/mime-type");

var _const = require("../../../../core/request/const");

var _helpers = require("../../../../core/request/helpers");

var _middlewares = _interopRequireDefault(require("../../../../core/request/modules/context/modules/middlewares"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/context/README.md]]
 * @packageDocumentation
 */

/**
 * Context of a request
 * @typeparam D - response data
 */
class RequestContext extends _middlewares.default {
  /**
   * Forks the specified request context and decorates it with additional parameters
   *
   * @param ctx
   * @param path - request path URL
   * @param resolver - function to resolve a request
   * @param args - additional arguments for the resolver
   */
  static decorateContext(ctx, path, resolver, ...args) {
    const forkedCtx = Object.create(ctx),
          params = (0, _helpers.merge)(ctx.params);
    params.path = path;
    const middlewareParams = {
      opts: params,
      ctx: forkedCtx,
      globalOpts: _const.globalOpts
    };

    const wrapProcessor = (namespace, fn, key) => (data, ...args) => {
      const time = Date.now(),
            res = fn(data, middlewareParams, ...args);

      if (namespace !== 'streamDecoders') {
        const loggingContext = `request:${namespace}:${key}:${path}`,
              getTime = () => `Finished at ${Date.now() - time}ms`,
              clone = data => () => Object.isPlainObject(data) || Object.isArray(data) ? Object.fastClone(data) : data;

        if (Object.isPromise(res)) {
          res.then(data => (0, _log.default)(loggingContext, getTime(), clone(data)), stderr);
        } else {
          (0, _log.default)(loggingContext, getTime(), clone(res));
        }
      }

      return res;
    };

    const encoders = [],
          decoders = [],
          streamDecoders = [];
    Object.forEach((0, _helpers.merge)(ctx.encoders), (el, key) => {
      encoders.push(wrapProcessor('encoders', el, key));
    });
    Object.forEach((0, _helpers.merge)(ctx.decoders), (el, key) => {
      decoders.push(wrapProcessor('decoders', el, key));
    });
    Object.forEach((0, _helpers.merge)(ctx.streamDecoders), (el, key) => {
      streamDecoders.push(wrapProcessor('streamDecoders', el, key));
    });
    Object.assign(forkedCtx, {
      params,
      encoders,
      decoders,
      streamDecoders,
      // Bind middlewares to a new context
      saveCache: ctx.saveCache.bind(forkedCtx),
      dropCache: ctx.dropCache.bind(forkedCtx),
      wrapAsResponse: ctx.wrapAsResponse.bind(forkedCtx),
      wrapRequest: ctx.wrapRequest.bind(forkedCtx),

      resolveRequest(api) {
        const reqPath = String(path),
              type = (0, _mimeType.getDataTypeFromURI)(reqPath); // Support for "mime string" requests

        if (type != null) {
          if (params.responseType == null) {
            params.responseType = type;
          }

          return params.url = reqPath;
        } // Append resolver


        let url = _const.isAbsoluteURL.test(reqPath) ? reqPath : (0, _url.concatURLs)(api != null ? this.resolveAPI(api) : null, reqPath);

        if (Object.isFunction(resolver)) {
          const res = resolver(url, middlewareParams, ...args);

          if (Object.isArray(res)) {
            url = (0, _url.concatURLs)(...res.map(String));
          } else if (res != null) {
            url = (0, _url.concatURLs)(url, res);
          }
        }

        return ctx.resolveRequest.call(this, url);
      }

    });
    return forkedCtx;
  }

}

exports.default = RequestContext;