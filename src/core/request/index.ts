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
import { CreateRequestOptions, Rewriter, RequestContext, Encoder, Decoder } from 'core/request/interface';
import { storage, requestCache, globalOpts, defaultRequestOpts } from 'core/request/const';

export * from 'core/request/interface';
export * from 'core/request/utils';
export { globalOpts, requestCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

export type RequestResponse<T = any> = Then<{
	data: T | null;
	response: Response;
}>;

export interface RequestFunctionResponse<T = any, A1 = any, A2 = any, A3 = any> {
	(arg1?: A1, arg2?: A2, arg3?: A3): RequestResponse<T>;
	(...args: any[]): RequestResponse<T>;
}

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
 * @param rewriter - url rewrite function
 * @param opts
 */
export default function create<T, A>(
	path: string,
	rewriter: (this: CreateRequestOptions<T>, arg: A) => Rewriter,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A>;

export default function create<T, A1, A2>(
	path: string,
	rewriter: (this: CreateRequestOptions<T>, arg1: A1, arg2: A2) => Rewriter,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A1, A2>;

export default function create<T, A1, A2, A3>(
	path: string,
	rewriter: (this: CreateRequestOptions<T>, arg1: A1, arg2: A2, arg3: A3) => Rewriter,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A1, A2, A3>;

// tslint:disable-next-line
export default function create<T>(path, ...args) {
	if (Object.isObject(path)) {
		const
			defOpts = path;

		return (path, rewriter, opts) => {
			if (Object.isObject(path)) {
				return create({...path, ...defOpts});
			}

			if (Object.isFunction(rewriter)) {
				return create(path, rewriter, {...defOpts, ...opts});
			}

			return create(path, {...defOpts, ...rewriter});
		};
	}

	let rewriter, opts: CreateRequestOptions<T>;

	if (args.length > 1) {
		([rewriter, opts] = args);

	} else {
		opts = args[0];
	}

	const p = <typeof defaultRequestOpts & CreateRequestOptions<T>>{
		...defaultRequestOpts,
		...opts
	};

	const baseCtx: RequestContext<T> = <any>{
		rewriter
	};

	/**
	 * Returns absolute path to API for the request
	 * @param [base]
	 */
	baseCtx.resolveAPI = (base = globalOpts.api) => {
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
	baseCtx.saveCache = (url) => (res) => {
		if (baseCtx.canCache && p.offlineCache) {
			storage.set(getStorageKey(url), res, p.cacheTime || (1).day()).catch(stderr);
		}

		if (baseCtx.cache) {
			const
				cache = baseCtx.cache as Cache<T>;

			if (cacheId) {
				clearTimeout(cacheId);
			}

			cache.set(url, res);

			if (p.cacheTime) {
				cacheId = setTimeout(() => cache.remove(url), p.cacheTime);
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
	baseCtx.wrapRequest = (url, promise) => {
		if (baseCtx.canCache) {
			const
				cache = baseCtx.pendingCache as Cache<Then<T>>;

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

	// tslint:disable-next-line
	return async (...args) => {
		const
			ctx = Object.create(baseCtx);

		/**
		 * Returns absolute path for the request
		 * @param api - API URL
		 */
		ctx.resolveURL = (api?) => {
			let
				url = concatUrls(api ? ctx.resolveAPI(api) : null, path);

			if (Object.isFunction(rewriter)) {
				const
					mut = rewriter.call(p, ...args) || {};

				if (mut.query) {
					Object.assign(ctx.query, mut.query);
					ctx.qs = toQueryString(ctx.query);
				}

				if (mut.subPath) {
					url = concatUrls(url, mut.subPath);
				}
			}

			return url + (ctx.qs ? `?${ctx.qs}` : '');
		};

		const baseURL = concatUrls(ctx.resolveAPI(), path);
		await Promise.all($C(p.middlewares).map((fn) => fn(baseURL, p, globalOpts)));

		Object.assign(ctx, {
			params: p,
			canCache: p.method === 'GET',
			query: Object.fastClone(p.query),
			encoders: (<Encoder[]>[]).concat(p.encoder || []),
			decoders: (<Decoder[]>[]).concat(p.decoder || [])
		});

		ctx.isOnline = await isOnline();
		ctx.qs = toQueryString(ctx.query);

		if (ctx.canCache) {
			ctx.pendingCache = new Cache<Then<T>>();
			ctx.cache = (<any>{queue: requestCache, never: null, forever: new Cache<T>()})[p.cacheStrategy];
		}

		if (p.headers) {
			p.headers = normalizeHeaders(p.headers);
		}

		const wrapAsResponse = async (res) => {
			const response = new Response(res, {type: 'object'});
			return {data: await response.decode(), response};
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

		if (ctx.canCache) {
			cacheKey = getRequestKey(url, p);
			fromCache = Boolean(ctx.cache && ctx.cache.exist(cacheKey));
		}

		const
			fromLocalStorage = !fromCache && ctx.canCache && p.offlineCache && !ctx.isOnline && await storage.exists(localKey);

		if (ctx.canCache) {
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
				if (!response.success) {
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
					return {data: null, response};
				}

				return {data, response};
			};

			const reqOpts = {
				...p,
				url,
				body: $C(ctx.encoders).reduce((res, e) => e.call(p, res), p.body)
			};

			const r = () => request(reqOpts).then(success).then(ctx.saveCache(cacheKey));
			res = ctx.prefetch ? ctx.prefetch.then(r) : r();
		}

		return ctx.wrapRequest(url, res);
	};
}
