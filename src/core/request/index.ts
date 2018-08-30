/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';

import log from 'core/log';
import request from 'core/request/engines';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import RequestContext from 'core/request/context';

import { isOnline } from 'core/net';
import { getStorageKey } from 'core/request/utils';
import { concatUrls } from 'core/url';

import { storage, globalOpts, defaultRequestOpts, mimeTypes } from 'core/request/const';
import { RequestFunctionResponse, RequestResponse, CreateRequestOptions, ResolverResult } from 'core/request/interface';

export * from 'core/request/interface';
export * from 'core/request/utils';

export { globalOpts, cache, pendingCache, dropCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

/**
 * Creates a new request with the specified options
 *
 * @param path
 * @param opts
 */
export default function create<T>(path: string, opts?: CreateRequestOptions<T>): RequestResponse<T>;

/**
 * Creates a request wrapper by the specified options
 * @param opts
 */
export default function create<T>(opts: CreateRequestOptions<T>): typeof create;

/**
 * @param path
 * @param resolver - request resolve function
 * @param opts
 */
export default function create<T, A>(
	path: string,
	resolver: (url: string, opts: CreateRequestOptions<T>, arg: A) => ResolverResult,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A>;

export default function create<T, A1, A2>(
	path: string,
	resolver: (url: string, opts: CreateRequestOptions<T>, arg1: A1, arg2: A2) => ResolverResult,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A1, A2>;

export default function create<T, A1, A2, A3>(
	path: string,
	resolver: (url: string, opts: CreateRequestOptions<T>, arg1: A1, arg2: A2, arg3: A3) => ResolverResult,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A1, A2, A3>;

// tslint:disable-next-line
export default function create<T>(path, ...args) {
	const merge = (...args: any[]) => Object.mixin({
		deep: true,
		concatArray: true,
		concatFn: (a: any[], b: any[]) => a.union(b),
		extendFilter: (d, v) => Array.isArray(v) || Object.isObject(v)
	}, undefined, ...args);

	if (Object.isObject(path)) {
		const
			defOpts = path;

		return (path, resolver, opts) => {
			if (Object.isObject(path)) {
				return create(merge(defOpts, path));
			}

			if (Object.isFunction(resolver)) {
				return create(path, resolver, merge(defOpts, opts));
			}

			return create(path, merge(defOpts, resolver));
		};
	}

	let
		resolver, opts: CreateRequestOptions<T>;

	if (args.length > 1) {
		([resolver, opts] = args);

	} else {
		opts = args[0];
	}

	const
		baseCtx: RequestContext<T> = new RequestContext<T>(opts);

	const run = (...args) => {
		const
			p: CreateRequestOptions<T> = merge(defaultRequestOpts, baseCtx.params),
			ctx = Object.create(baseCtx);

		const addLogger = (type) => (fn, key) => (d) => {
			const
				time = Date.now(),
				res = fn(d, {opts: p, ctx, globalOpts});

			const
				logKey = `request:${type}:${key}:${path}`,
				getTime = () => `Finished at ${Date.now() - time}ms`,
				clone = (data) => () => Object.isObject(data) || Object.isArray(data) ? Object.fastClone(data) : data;

			if (Object.isPromise(res)) {
				res.then((data) => log(logKey, getTime(), clone(data)));

			} else {
				log(logKey, getTime(), clone(res));
			}

			return res;
		};

		Object.assign(ctx, {
			// Merge request options
			params: p,
			encoders: $C(merge(ctx.encoders)).map(addLogger('encoders')),
			decoders: $C(merge(ctx.decoders)).map(addLogger('decoders')),

			// Bind middlewares to new context
			saveCache: ctx.saveCache.bind(ctx),
			dropCache: ctx.dropCache.bind(ctx),
			wrapAsResponse: ctx.wrapAsResponse.bind(ctx),
			wrapRequest: ctx.wrapRequest.bind(ctx),

			// Wrap resolve function with .resolver
			resolveURL(api?: string | null | undefined): string {
				if (/^\w+:/.test(path)) {
					const
						dataURI = /^data:([^;]+);/.exec(path),
						type = dataURI && dataURI[1];

					if (type && !p.responseType) {
						if (mimeTypes[type]) {
							p.responseType = mimeTypes[type];

						} else if (/^text(?:\/|$)/.test(type)) {
							p.responseType = 'text';

						} else {
							p.responseType = 'arrayBuffer';
						}
					}

					return path;
				}

				let
					url = concatUrls(api ? this.resolveAPI(api) : null, path);

				if (Object.isFunction(resolver)) {
					const
						res = resolver(url, p, ...args);

					if (Object.isArray(res)) {
						url = <string>res[0];

					} else if (res) {
						url = concatUrls(url, res);
					}
				}

				return baseCtx.resolveURL.call(this, url);
			}
		});

		const then = new Then(async (resolve, reject, onAbort) => {
			onAbort((err) => {
				reject(err || new RequestError('abort'));
			});

			await new Promise((r) => {
				setImmediate(r);
			});

			ctx.then = then;
			ctx.isOnline = (await Then.resolve(isOnline(), then)).status;

			const arr = await Then.all($C(p.middlewares).reduce((arr, fn) => {
				arr.push(fn({opts: p, ctx, globalOpts}));
				return arr;
			}, [] as any[]), then);

			if ($C(arr).some(Object.isFunction)) {
				resolve((() => {
					const
						res = $C(arr).filter(Object.isFunction).map((fn) => (<Function>fn)());

					if (res.length <= 1) {
						return res[0];
					}

					return res;
				})());

				return;
			}

			const
				url = ctx.resolveURL(globalOpts.api),
				cacheKey = ctx.cacheKey;

			let
				localCacheKey,
				fromCache = false,
				fromLocalStorage = false;

			if (ctx.canCache) {
				if (ctx.pendingCache.has(cacheKey)) {
					try {
						const
							res = await ctx.pendingCache.get(cacheKey);

						if (res && res.response instanceof Response) {
							resolve(res);
							return;
						}

					} catch (err) {
						if (err && !{clearAsync: true, abort: true}[err.type]) {
							reject(err);
							return;
						}
					}
				}

				localCacheKey = getStorageKey(cacheKey);
				fromCache = ctx.cache.has(cacheKey);
				fromLocalStorage = Boolean(!fromCache && p.offlineCache && !ctx.isOnline && await storage.has(localCacheKey));
			}

			let
				res,
				cache = 'none';

			if (fromCache) {
				cache = 'memory';
				res = Then.immediate(() => ctx.cache.get(cacheKey), then)
					.then(ctx.wrapAsResponse);

			} else if (fromLocalStorage) {
				cache = 'offline';
				res = Then.immediate(() => storage.get(localCacheKey), then)
					.then(ctx.wrapAsResponse)
					.then(ctx.saveCache);

			} else if (!ctx.isOnline && !p.externalRequest) {
				res = Then.reject(new RequestError('offline'));

			} else {
				const success = async (response) => {
					if (!response.ok) {
						throw new RequestError('invalidStatus', {response});
					}

					const
						data = await response.decode();

					if (p.externalRequest && !ctx.isOnline && !data) {
						throw new RequestError('offline');
					}

					return {data, response, ctx, dropCache: ctx.dropCache};
				};

				const reqOpts = {
					...p,
					url,
					parent: then,
					decoder: ctx.decoders,
					body: await $C(ctx.encoders)
						.to(Then.resolve(p.body, then))
						.reduce((res, fn, i) => res.then((obj) => fn(i ? obj : Object.fastClone(obj))))
				};

				res = request(reqOpts).then(success).then(ctx.saveCache);
			}

			res.then((response) => log(`request:response:${path}`, response.data, {
				cache,
				externalRequest: opts.externalRequest,
				request: opts
			}));

			resolve(ctx.wrapRequest(res));
		});

		return then;
	};

	if (Object.isFunction(resolver)) {
		return run;
	}

	return run();
}
