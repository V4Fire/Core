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

import { concatURLs } from 'core/url';
import { getDataTypeFromURI } from 'core/mime-type';

import { globalOpts, isAbsoluteURL } from 'core/request/const';
import { merge } from 'core/request/helpers';

import type {

	NormalizedCreateRequestOptions,
	RequestResolver,

	WrappedEncoder,
	WrappedDecoder,
	WrappedStreamDecoder

} from 'core/request/interface';

import Super from 'core/request/modules/context/modules/middlewares';

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

		params.path = path;

		const middlewareParams = {
			opts: params,
			ctx: forkedCtx,
			globalOpts
		};

		const wrapProcessor = (namespace, fn, key) => (data, ...args) => {
			const
				time = Date.now(),
				res = fn(data, middlewareParams, ...args);

			if (namespace !== 'streamDecoders') {
				const
					loggingContext = `request:${namespace}:${key}:${path}`,
					getTime = () => `Finished at ${Date.now() - time}ms`,
					clone = (data) => (() => Object.isPlainObject(data) || Object.isArray(data) ? Object.fastClone(data) : data);

				if (Object.isPromise(res)) {
					res.then((data) => log(loggingContext, getTime(), clone(data)), stderr);

				} else {
					log(loggingContext, getTime(), clone(res));
				}
			}

			return res;
		};

		const
			encoders: WrappedEncoder[] = [],
			decoders: WrappedDecoder[] = [],
			streamDecoders: WrappedStreamDecoder[] = [];

		Object.forEach(merge(ctx.encoders), (el, key) => {
			encoders.push(wrapProcessor('encoders', el, key));
		});

		Object.forEach(merge(ctx.decoders), (el, key) => {
			decoders.push(wrapProcessor('decoders', el, key));
		});

		Object.forEach(merge(ctx.streamDecoders), (el, key) => {
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

			resolveRequest(api?: Nullable<string>): string {
				const
					reqPath = String(path),
					type = getDataTypeFromURI(reqPath);

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
					concatURLs(api != null ? this.resolveAPI(api) : null, reqPath);

				if (Object.isFunction(resolver)) {
					const
						res = resolver(url, middlewareParams, ...args);

					if (Object.isArray(res)) {
						url = concatURLs(...res.map(String));

					} else if (res != null) {
						url = concatURLs(url, res);
					}
				}

				return ctx.resolveRequest.call(this, url);
			}
		});

		return forkedCtx;
	}
}
