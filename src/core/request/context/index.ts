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

import log from 'core/log';

import { concatUrls } from 'core/url';
import { getDataTypeFromURL } from 'core/mime-type';

import { merge } from 'core/request/utils';
import { globalOpts, isAbsoluteURL } from 'core/request/const';

import {

	NormalizedCreateRequestOptions,
	RequestResolver,
	WrappedEncoder,
	WrappedDecoder

} from 'core/request/interface';

import Super from 'core/request/context/modules/middlewares';

/**
 * Context of a request
 * @typeparam D - response data
 */
export default class RequestContext<D = unknown> extends Super<D> {
	/**
	 * Forks the specified request context and decorates it with additional parameters
	 *
	 * @param ctx
	 * @param path - request path URL
	 * @param resolver - function to resolve a request
	 * @param args - additional arguments for the resolver
	 */
	static decorateContext<CTX extends RequestContext<any>>(
		ctx: CTX,
		path: string,
		resolver?: RequestResolver,
		...args: unknown[]
	): CTX {
		const
			forkedCtx = Object.create(ctx),
			params = merge<NormalizedCreateRequestOptions>(ctx.params);

		const middlewareParams = {
			opts: params,
			ctx: forkedCtx,
			globalOpts
		};

		const wrapProcessor = (namespace, fn, key) => (data, ...args) => {
			const
				time = Date.now(),
				res = fn(data, middlewareParams, ...args);

			const
				loggingContext = `request:${namespace}:${key}:${path}`,
				getTime = () => `Finished at ${Date.now() - time}ms`,
				clone = (data) => () => Object.isPlainObject(data) || Object.isArray(data) ? Object.fastClone(data) : data;

			if (Object.isPromise(res)) {
				res.then((data) => log(loggingContext, getTime(), clone(data)));

			} else {
				log(loggingContext, getTime(), clone(res));
			}

			return res;
		};

		const
			encoders = <WrappedEncoder[]>[],
			decoders = <WrappedDecoder[]>[];

		Object.forEach(merge(ctx.encoders), (el, key) => {
			encoders.push(wrapProcessor('encoders', el, key));
		});

		Object.forEach(merge(ctx.decoders), (el, key) => {
			decoders.push(wrapProcessor('decoders', el, key));
		});

		Object.assign(forkedCtx, {
			params,

			encoders,
			decoders,

			// Bind middlewares to a new context
			saveCache: ctx.saveCache.bind(forkedCtx),
			dropCache: ctx.dropCache.bind(forkedCtx),
			wrapAsResponse: ctx.wrapAsResponse.bind(forkedCtx),
			wrapRequest: ctx.wrapRequest.bind(forkedCtx),

			resolveRequest(api?: Nullable<string>): string {
				const
					reqPath = String(path),
					type = getDataTypeFromURL(reqPath);

				// Support for "mime string" requests
				if (type != null) {
					if (params.responseType == null) {
						params.responseType = type;
					}

					return params.url = reqPath;
				}

				// Append resolver

				let url = isAbsoluteURL.test(reqPath) ?
					reqPath :
					concatUrls(api != null ? this.resolveAPI(api) : null, reqPath);

				if (Object.isFunction(resolver)) {
					const
						res = resolver(url, middlewareParams, ...args);

					if (Object.isArray(res)) {
						url = concatUrls(...res.map(String));

					} else if (res != null) {
						url = concatUrls(url, res);
					}
				}

				return ctx.resolveRequest.call(this, url);
			}
		});

		return forkedCtx;
	}
}
