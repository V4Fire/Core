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
import { normalizeHeaders, getStorageKey, getRequestKey } from 'core/request/utils';
import { concatUrls, toQueryString } from 'core/url';
import { storage, requestCache, globalOpts, defaultRequestOpts } from 'core/request/const';
import {

	RequestFunctionResponse,
	RequestResponseObject,
	CreateRequestOptions,
	ResolverResult,
	RequestContext,
	Encoder,
	Decoder

} from 'core/request/interface';

export * from 'core/request/interface';
export * from 'core/request/utils';
export { globalOpts, requestCache } from 'core/request/const';
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
	if (Object.isObject(path)) {
		const
			defOpts = path;

		return (path, resolver, opts) => {
			if (Object.isObject(path)) {
				return create({...path, ...defOpts});
			}

			if (Object.isFunction(resolver)) {
				return create(path, resolver, {...defOpts, ...opts});
			}

			return create(path, {...defOpts, ...resolver});
		};
	}

	let
		resolver, opts: CreateRequestOptions<T>;

	if (args.length > 1) {
		([resolver, opts] = args);

	} else {
		opts = args[0];
	}

	opts = <typeof defaultRequestOpts & CreateRequestOptions<T>>{
		...defaultRequestOpts,
		...opts
	};

	const
		canCache = opts.method === 'GET';

	const baseCtx: RequestContext<T> = <any>{
		resolver,
		canCache,
		...canCache && {
			pendingCache: new Cache<Then<T>>(),
			cache: (() => {
				switch (opts.cacheStrategy) {
					case 'queue':
						return requestCache;

					case 'forever':
						return new Cache<T>();

					default:
						return null;
				}
			})()
		}
	};

	// tslint:disable-next-line
	return async (...args) => {
		const p = {
			...opts,
			query: Object.fastClone(opts.query),
			headers: {...opts.headers},
			api: {...opts.api}
		};

		const
			ctx = Object.create(baseCtx);

		/**
		 * Returns absolute path to API for the request
		 * @param [base]
		 */
		ctx.resolveAPI = (base = globalOpts.api) => {
			const
				a = <any>p.api,
				rgxp = /(?:^|(https?:\/\/)(?:(.*?)\.)?(.*?)\.(.*?))(\/.*|$)/;

			if (!base) {
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

			return base.replace(rgxp, (str, protocol, domain3, domain2, zone, nm) => {
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

		let cacheId;

		/**
		 * Factory for a cache middleware
		 * @param url - request URL
		 */
		ctx.saveCache = (url) => (res: RequestResponseObject) => {
			if (canCache && p.offlineCache) {
				storage.set(getStorageKey(url), res.data, p.cacheTTL || (1).day()).catch(stderr);
			}

			if (ctx.cache) {
				const
					cache = ctx.cache as Cache<T>;

				if (cacheId) {
					clearTimeout(cacheId);
				}

				cache.set(url, res.data);

				if (p.cacheTTL) {
					cacheId = setTimeout(() => cache.remove(url), p.cacheTTL);
				}
			}

			return res;
		};

		/**
		 * Wrapper for the request (pending cache, etc.)
		 *
		 * @param url - request URL
		 * @param promise
		 */
		ctx.wrapRequest = (url, promise) => {
			if (canCache) {
				const
					cache = ctx.pendingCache as Cache<Then<T>>;

				promise = promise.then(
					(v) => {
						cache.remove(url);
						return v;
					},

					(r) => {
						cache.remove(url);
						throw r;
					},

					() => {
						cache.remove(url);
					}
				);

				cache.set(url, promise);
			}

			return promise.then();
		};

		/**
		 * Returns absolute path for the request
		 * @param api - API URL
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

				ctx.qs = toQueryString(ctx.query);
			}

			return url + (ctx.qs ? `?${ctx.qs}` : '');
		};

		const
			baseURL = concatUrls(ctx.resolveAPI(), path);

		await Promise.all($C(p.middlewares as any[]).to([] as any[]).reduce((arr, fn) => {
			// @ts-ignore
			arr.push(fn(baseURL, p, globalOpts));
			return arr;
		}));

		if (p.headers) {
			p.headers = normalizeHeaders(p.headers);
		}

		Object.assign(ctx, {
			params: p,
			query: p.query,
			qs: toQueryString(p.query),
			isOnline: await isOnline(),
			encoders: (<Encoder[]>[]).concat(p.encoder || []),
			decoders: (<Decoder[]>[]).concat(p.decoder || [])
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
				ctx,
				response,
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
			localKey = getStorageKey(url);

		let
			cacheKey,
			fromCache = false;

		if (canCache) {
			cacheKey = ctx.cacheKey = ctx.cacheKey || getRequestKey(url, p);
			fromCache = Boolean(ctx.cache && ctx.cache.exist(cacheKey));
		}

		const
			fromLocalStorage = !fromCache && canCache && p.offlineCache && !ctx.isOnline && await storage.exists(localKey);

		if (canCache) {
			const
				cache = ctx.pendingCache as Cache<Then<T>>;

			if (cache.exist(url)) {
				return cache.get(url).then();
			}
		}

		let res;
		if (fromCache) {
			res = Then.immediate(() => (<Cache>ctx.cache).get(cacheKey)).then(wrapAsResponse);

		} else if (fromLocalStorage) {
			res = Then.immediate(() => storage.get(localKey))
				.then(<any>ctx.saveCache(cacheKey))
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
						ctx,
						response,
						dropCache
					};
				}

				return {data, ctx, response, dropCache};
			};

			const reqOpts = {
				...p,
				url,
				decoder: ctx.decoders,
				body: $C(ctx.encoders).reduce((res, e) => e.call(p, res), p.body)
			};

			const r = () => request(reqOpts).then(success).then(ctx.saveCache(cacheKey));
			res = ctx.prefetch ? ctx.prefetch.then(r) : r();
		}

		return ctx.wrapRequest(url, res);
	};
}
