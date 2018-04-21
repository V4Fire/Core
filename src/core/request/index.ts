/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';

import StatusCodes from 'core/statusCodes';
import RequestError from 'core/request/error';

import Response from 'core/request/response';
import request from 'core/request/engines';
import configurator from 'core/request/configurator';

import { Cache } from 'core/cache';
import { isOnline } from 'core/net';
import { normalizeHeaders, applyQueryForStr, getStorageKey, getRequestKey } from 'core/request/utils';
import { concatUrls, toQueryString } from 'core/url';
import {

	storage,
	globalCache,
	pendingCache,
	sharedCache,
	globalOpts,
	defaultRequestOpts

} from 'core/request/const';

import {

	RequestFunctionResponse,
	RequestResponseObject,
	CreateRequestOptions,
	ResolverResult,
	RequestContext

} from 'core/request/interface';

export * from 'core/request/interface';
export * from 'core/request/utils';

export { globalOpts, globalCache } from 'core/request/const';
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
		concatFn: (a, b) => a.union(b)
	}, {}, ...args);

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

	opts = merge(defaultRequestOpts, opts);

	const
		canCache = opts.method === 'GET',
		baseCtx: RequestContext<T> = <any>{canCache};

	if (canCache) {
		Object.assign(baseCtx, {
			pendingCache,
			cache: (() => {
				switch (opts.cacheStrategy) {
					case 'queue':
						return globalCache;

					case 'forever':
						if (opts.cacheId) {
							return sharedCache[opts.cacheId] = sharedCache[opts.cacheId] || new Cache<T>();
						}

						return new Cache<T>();

					default:
						return null;
				}
			})()
		});
	}

	// tslint:disable-next-line
	return async (...args) => {
		const
			p: CreateRequestOptions<T> = merge(opts),
			ctx = Object.create(baseCtx);

		/**
		 * Returns absolute path to API for the request
		 * @param [api]
		 */
		ctx.resolveAPI = (api = globalOpts.api) => {
			const
				a = <any>p.api,
				rgxp = /(?:^|(https?:\/\/)(?:(.*?)\.)?(.*?)\.(.*?))(\/.*|$)/;

			if (!api) {
				const def = {
					namespace: '',
					...a
				};

				const
					nm = def.namespace;

				if (!def.protocol) {
					return nm[0] === '/' ? nm : `/${nm}`;
				}

				return concatUrls(
					[
						def.protocol + (def.domain3 ? `${def.domain3}.` : '') + a.domain2,
						def.zone
					].join('.'),

					nm
				);
			}

			const v = (f, def) => {
				const
					v = a[f] != null ? a[f] : def || '';

				if (f === 'domain3') {
					return v ? `${v}.` : '';
				}

				return v;
			};

			return api.replace(rgxp, (str, protocol, domain3, domain2, zone, nm) => {
				nm = v('namespace', nm);

				if (!protocol) {
					return nm[0] === '/' ? nm : `/${nm}`;
				}

				return concatUrls(
					[
						v('protocol', protocol) + v('domain3', domain3) + v('domain2', domain2),
						v('zone', zone)
					].join('.'),

					nm
				);
			});
		};

		let
			cacheId;

		/**
		 * Cache middleware
		 */
		ctx.saveCache = (res: RequestResponseObject) => {
			if (canCache && p.offlineCache) {
				storage
					.set(getStorageKey(ctx.cacheKey), res.data, p.cacheTTL || (1).day())
					.catch(stderr);
			}

			if (ctx.cache) {
				const
					cache = ctx.cache as Cache<T>;

				if (cacheId) {
					clearTimeout(cacheId);
				}

				cache.set(
					ctx.cacheKey,
					res.data
				);

				if (p.cacheTTL) {
					cacheId = setTimeout(() => cache.remove(cacheKey), p.cacheTTL);
				}
			}

			return res;
		};

		/**
		 * Wrapper for the request (pending cache, etc.)
		 * @param promise
		 */
		ctx.wrapRequest = (promise) => {
			if (canCache) {
				const
					cache = ctx.pendingCache as Cache<Then<T>>,
					key = ctx.cacheKey;

				promise = promise.then(
					(v) => {
						cache.remove(key);
						return v;
					},

					(r) => {
						cache.remove(key);
						throw r;
					},

					() => {
						cache.remove(key);
					}
				);

				cache.set(key, promise);
			}

			return promise.then();
		};

		/**
		 * Returns an absolute path for the request
		 * @param [api]
		 */
		ctx.resolveURL = (api?) => {
			let
				url = concatUrls(api ? ctx.resolveAPI(api) : null, path);

			if (Object.isFunction(resolver)) {
				const
					res = resolver(url, p, ...args);

				if (Object.isArray(res)) {
					url = <string>res[0];

				} else if (res) {
					url = concatUrls(url, res);
				}
			}

			if (p.headers) {
				p.headers = normalizeHeaders(p.headers, ctx.query);
			}

			url = applyQueryForStr(url, ctx.query, /:([^/]+)/g);

			if (canCache) {
				ctx.cacheKey = getRequestKey(url, p);
			}

			if ($C(ctx.query).length()) {
				return `${url}?${toQueryString(ctx.query)}`;
			}

			return url;
		};

		const
			baseURL = concatUrls(ctx.resolveAPI(), path);

		await Promise.all($C(p.middlewares as any[]).to([] as any[]).reduce((arr, fn) => {
			// @ts-ignore
			arr.push(fn(baseURL, p, globalOpts));
			return arr;
		}));

		Object.assign(ctx, {
			params: p,
			query: p.query,
			isOnline: await isOnline(),
			encoders: p.encoder ? Object.isFunction(p.encoder) ? [p.encoder] : p.encoder : [],
			decoders: p.decoder ? Object.isFunction(p.decoder) ? [p.decoder] : p.decoder : []
		});

		async function dropCache(): Promise<void> {
			if (ctx.cache && ctx.cacheKey) {
				await (<Cache>ctx.cache).remove(ctx.cacheKey);
			}
		}

		const wrapAsResponse = async (res) => {
			const response = new Response(res, {
				responseType: 'object'
			});

			return {
				data: await response.decode(),
				response,
				ctx,
				dropCache
			};
		};

		const
			newRes = await configurator(ctx, globalOpts);

		if (newRes) {
			return Then.resolve(newRes()).then(wrapAsResponse);
		}

		const
			url = ctx.resolveURL(globalOpts.api),
			cacheKey = ctx.cacheKey;

		let
			localCacheKey,
			fromCache = false,
			fromLocalStorage = false;

		if (canCache) {
			localCacheKey = getStorageKey(cacheKey);

			const
				cache = ctx.pendingCache as Cache<Then<T>>;

			if (cache.exist(cacheKey)) {
				return cache.get(cacheKey).then();
			}

			fromCache = Boolean(ctx.cache && ctx.cache.exist(cacheKey));
			fromLocalStorage = Boolean(!fromCache && p.offlineCache && !ctx.isOnline && await storage.exists(localCacheKey));
		}

		let
			res;

		if (fromCache) {
			res = Then.immediate(() => (<Cache>ctx.cache).get(cacheKey)).then(wrapAsResponse);

		} else if (fromLocalStorage) {
			res = Then.immediate(() => storage.get(localCacheKey))
				.then(ctx.saveCache)
				.then(wrapAsResponse);

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
						dropCache
					};
				}

				return {data, response, ctx, dropCache};
			};

			const reqOpts = {
				...p,
				url,
				decoder: ctx.decoder,
				body: $C(ctx.encoders).reduce((res, e) => e(res), p.body)
			};

			const r = () => request(reqOpts).then(success).then(ctx.saveCache(cacheKey));
			res = ctx.prefetch ? ctx.prefetch.then(r) : r();
		}

		return ctx.wrapRequest(res);
	};
}
