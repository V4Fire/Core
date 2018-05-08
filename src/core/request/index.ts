/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';

import request from 'core/request/engines';
import StatusCodes from 'core/statusCodes';
import RequestError from 'core/request/error';
import RequestContext from 'core/request/context';

import { isOnline } from 'core/net';
import { getStorageKey } from 'core/request/utils';
import { concatUrls } from 'core/url';

import { storage, globalCache, globalOpts, defaultRequestOpts } from 'core/request/const';
import { RequestFunctionResponse, CreateRequestOptions, ResolverResult } from 'core/request/interface';

export * from 'core/request/interface';
export * from 'core/request/utils';

export { globalOpts, globalCache, pendingCache, sharedCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

/**
 * Creates a new request with the specified options
 *
 * @param path
 * @param opts
 */
// @ts-ignore
export default function create<T>(path: string, opts?: CreateRequestOptions<T>): RequestFunctionResponse<T>;

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
		concatFn: (a: any[], b: any[]) => a.union(b)
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

	// tslint:disable-next-line
	return (...args) => {
		const
			p: CreateRequestOptions<T> = merge(defaultRequestOpts, baseCtx.params),
			ctx = Object.create(baseCtx);

		Object.assign(ctx, {
			// Merge request options
			params: p,
			encoders: merge(ctx.encoders),
			decoders: merge(ctx.decoders),

			// Bind middlewares to new context
			saveCache: ctx.saveCache.bind(ctx),
			dropCache: ctx.dropCache.bind(ctx),
			wrapAsResponse: ctx.wrapAsResponse.bind(ctx),
			wrapRequest: ctx.wrapRequest.bind(ctx),

			// Wrap resolve function with .resolver
			resolveURL(api?: string | null | undefined): string {
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

		return new Then(async (resolve, reject) => {
			ctx.isOnline = await isOnline();

			try {
				const arr = await Promise.all($C(p.middlewares).to([]).reduce((arr: any[], fn) => {
					arr.push(fn({opts: p, ctx, globalOpts}));
					return arr;
				}));

				if ($C(arr).some(Object.isFunction)) {
					resolve((() => {
						const
							res = $C(arr).filter(Object.isFunction).map((fn) => fn());

						if (res.length <= 1) {
							return res[0];
						}

						return res;
					})());

					return;
				}

			} catch (err) {
				reject(err);
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
					resolve(ctx.pendingCache.get(cacheKey).then());
					return;
				}

				localCacheKey = getStorageKey(cacheKey);
				fromCache = ctx.cache.has(cacheKey);
				fromLocalStorage = Boolean(!fromCache && p.offlineCache && !ctx.isOnline && await storage.has(localCacheKey));
			}

			let
				res;

			if (fromCache) {
				res = Then.immediate(() => ctx.cache.get(cacheKey))
					.then(ctx.wrapAsResponse);

			} else if (fromLocalStorage) {
				res = Then.immediate(() => storage.get(localCacheKey))
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

					if (
						response.status === StatusCodes.NO_CONTENT ||
						response.status === StatusCodes.OK && !data
					) {
						return {
							data: null,
							response,
							ctx,
							dropCache: ctx.dropCache
						};
					}

					return {data, response, ctx, dropCache: ctx.dropCache};
				};

				const reqOpts = {
					...p,
					url,
					decoder: ctx.decoders,
					body: $C(ctx.encoders).reduce((res, e, i) => e(i ? res : Object.fastClone(res)), p.body)
				};

				res = request(reqOpts).then(success).then(ctx.saveCache);
			}

			resolve(ctx.wrapRequest(res));
		});
	};
}
