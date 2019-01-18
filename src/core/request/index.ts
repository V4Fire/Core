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
export default function create<T = unknown>(path: string, opts?: CreateRequestOptions<T>): RequestResponse<T>;

/**
 * Creates a request wrapper by the specified options
 * @param opts
 */
export default function create<T = unknown>(opts: CreateRequestOptions<T>): typeof create;

/**
 * @param path
 * @param resolver - request resolve function
 * @param opts
 */
export default function create<T = unknown, A extends unknown[] = unknown[]>(
	path: string,
	resolver: (url: string, opts: CreateRequestOptions<T>, ...args: A) => ResolverResult,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A extends (infer V)[] ? V[] : unknown[]>;

export default function create<T = unknown>(path: any, ...args: any[]): unknown {
	const merge = (...args: unknown[]) => Object.mixin({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
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

		const wrapProcessor = (namespace) => (fn, key) => (data, ...args) => {
			const
				time = Date.now(),
				res = fn(data, {opts: p, ctx, globalOpts}, ...args);

			const
				logKey = `request:${namespace}:${key}:${path}`,
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
			encoders: $C(merge(ctx.encoders)).map(wrapProcessor('encoders')),
			decoders: $C(merge(ctx.decoders)).map(wrapProcessor('decoders')),

			// Bind middlewares to new context
			saveCache: ctx.saveCache.bind(ctx),
			dropCache: ctx.dropCache.bind(ctx),
			wrapAsResponse: ctx.wrapAsResponse.bind(ctx),
			wrapRequest: ctx.wrapRequest.bind(ctx),

			// Wrap resolve function with .resolver
			resolveURL(api?: Nullable<string>): string {
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
			}, [] as unknown[]), then);

			const applyEncoders = (data) => $C(ctx.encoders)
				.to(Then.resolve(data, then))
				.reduce((res, fn, i) => res.then((obj) => fn(i ? obj : Object.fastClone(obj))));

			if (ctx.withoutBody) {
				p.query = await applyEncoders(p.query);

			} else {
				p.body = await applyEncoders(p.body);
			}

			if (Object.isObject(p.query) && 'meta' in p.query) {
				opts.meta = p.query.meta;
				delete p.query.meta;
			}

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
				fromLocalStorage = Boolean(
					!fromCache &&
					p.offlineCache &&
					!ctx.isOnline &&
					await (await storage).has(localCacheKey)
				);
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
				res = Then.immediate(() => storage.then((storage) => storage.get(localCacheKey)), then)
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
					decoder: ctx.decoders
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
