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

/**
 * Creates a new request with the specified options
 *
 * @param path
 * @param opts
 */
// @ts-ignore
export default function create<T>(path: string, opts?: CreateOptions<T>): () => Then<T>;

/**
 * Creates a request wrapper by the specified options
 * @param opts
 */
export default function create<T, A>(opts: CreateRequestOptions<T>): typeof create;

/**
 * @param path
 * @param rewriter - url rewrite function
 * @param opts
 */
export default function create<T, A>(
	path: string,
	rewriter: (this: CreateRequestOptions<T>, arg: A) => Rewriter,
	opts?: CreateRequestOptions<T>
): (a: A) => Then<T>;

export default function create<T, A1, A2>(
	path: string,
	rewriter: (this: CreateRequestOptions<T>, arg1: A1, arg2: A2) => Rewriter,
	opts?: CreateRequestOptions<T>
): (arg1: A1, arg2: A2) => Then<T>;

export default function create<T, A1, A2, A3>(
	path: string,
	rewriter: (this: CreateRequestOptions<T>, arg1: A1, arg2: A2, arg3: A3) => Rewriter,
	opts?: CreateRequestOptions<T>
): (arg1: A1, arg2: A2, arg3: A3) => Then<T>;

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

	let rewriter, params: CreateRequestOptions<T>;

	if (args.length > 1) {
		([rewriter, params] = args);

	} else {
		params = args[0];
	}

	const p = <typeof defaultRequestOpts & CreateRequestOptions<T>>{
		...defaultRequestOpts,
		...params
	};

	if (p.headers) {
		p.headers = normalizeHeaders(p.headers);
	}

	const ctx: RequestContext<T> = <any>{
		rewriter,
		params: p,
		canCache: p.method === 'GET',
		query: p.query ? Object.fastClone(p.query) : {},
		encoders: (<Encoder[]>[]).concat(p.encoder || []),
		decoders: (<Decoder[]>[]).concat(p.decoder || [])
	};

	if (ctx.canCache) {
		ctx.pendingCache = new Cache<Then<T>>();
		ctx.cache = (<any>{queue: requestCache, never: null, forever: new Cache<T>()})[p.cacheStrategy];
	}

	ctx.qs = toQueryString(ctx.query);

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
	ctx.saveCache = (url) => (res) => {
		if (ctx.canCache && p.offline) {
			storage.set(getStorageKey(url), res, p.cacheTime || (1).day()).catch(stderr);
		}

		if (ctx.cache) {
			const
				cache = ctx.cache as Cache<T>;

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
	 * Wrapper for the request (pending cache and etc.)
	 *
	 * @param url - request URL
	 * @param promise
	 */
	ctx.wrapRequest = (url, promise) => {
		if (ctx.canCache) {
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

	// tslint:disable-next-line
	return async (...args) => {
		let res;

		ctx.isOnline = await isOnline();

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

		const
			newRes = await configurator(ctx, globalOpts);

		if (newRes) {
			return Then.resolve(newRes());
		}

		if (globalOpts.token) {
			p.headers.Authorization = globalOpts.token;
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
			fromLocalStorage = !fromCache && ctx.canCache && p.offline && !ctx.isOnline && await storage.exists(localKey);

		if (ctx.canCache) {
			const
				cache = ctx.pendingCache as Cache<Then<T>>;

			if (cache.exist(url)) {
				return cache.get(url).then();
			}
		}

		const
			wrapAsResponse = (res) => new Response(res, {type: 'object'}).decode();

		if (fromCache) {
			res = Then.immediate(() => (<Cache>ctx.cache).get(cacheKey)).then(wrapAsResponse);

		} else if (fromLocalStorage) {
			res = Then.immediate(() => storage.get(localKey))
				.then(wrapAsResponse)
				.then(<any>ctx.saveCache(cacheKey));

		} else if (!ctx.isOnline && !p.externalRequest) {
			res = Then.reject(new RequestError('offline'));

		} else {
			const success = (response) => {
				if (!response.success) {
					throw new RequestError('Invalid status', {response});
				}

				response.decode().then((res) => {
					if (p.externalRequest && !ctx.isOnline && !res) {
						throw new RequestError('offline');
					}

					if (
						response.status === StatusCodes.NO_CONTENT ||
						response.status === StatusCodes.OK && !res
					) {
						return null;
					}

					return res;
				});
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
