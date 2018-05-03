/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Response from 'core/request/response';

import { Cache } from 'core/cache';
import { concatUrls, toQueryString } from 'core/url';
import { normalizeHeaders, applyQueryForStr, getStorageKey, getRequestKey } from 'core/request/utils';
import { Encoders, Decoders, RequestQuery, CreateRequestOptions, RequestResponseObject } from 'core/request/interface';
import { globalCache, pendingCache, sharedCache, storage, globalOpts, defaultRequestOpts } from 'core/request/const';

export default class RequestContext<T = any> {
	/**
	 * True if the client is online
	 */
	isOnline: boolean = false;

	/**
	 * List/table of request encoders
	 */
	encoders: Encoders;

	/**
	 * List/table of response decoders
	 */
	decoders: Decoders;

	/**
	 * Cache key
	 */
	cacheKey?: string;

	/**
	 * Request parameters
	 */
	readonly params!: typeof defaultRequestOpts & CreateRequestOptions<T>;

	/**
	 * Alias for .params.query
	 */
	get query(): RequestQuery {
		return this.params.query;
	}

	/**
	 * True if a request can be cached
	 */
	readonly canCache: boolean;

	/**
	 * Cache object
	 */
	readonly cache: Cache = globalCache;

	/**
	 * Cache object for pending requests
	 */
	readonly pendingCache: Cache = pendingCache;

	/**
	 * Cache timeout id (for setTimeout)
	 */
	protected cacheTimeoutId?: number;

	/**
	 * @param [params] - request parameters
	 */
	constructor(params?: CreateRequestOptions<T>) {
		const p = this.params = <any>Object.mixin({
			deep: true,
			concatArray: true,
			concatFn: (a: any[], b: any[]) => a.union(b)
		}, {}, params);

		this.canCache = p.method === 'GET';
		this.encoders = p.encoder ? Object.isFunction(p.encoder) ? [p.encoder] : p.encoder : [];
		this.decoders = p.decoder ? Object.isFunction(p.decoder) ? [p.decoder] : p.decoder : [];

		if (this.canCache && p.cacheStrategy === 'forever') {
			if (p.cacheId) {
				const id = p.cacheId;
				this.cache = sharedCache[id] = sharedCache[id] || new Cache<T>();
			}

			this.cache = new Cache<T>();
		}
	}

	/**
	 * Returns an absolute path to the API for a request
	 * @param [api] - base api url
	 */
	resolveAPI(api: string | null | undefined = globalOpts.api): string {
		const
			a = <any>this.params.api,
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
	}

	/**
	 * Returns an absolute path for the request
	 * @param [url] - base request url
	 */
	resolveURL(url?: string | null | undefined): string {
		if (url == null) {
			return '';
		}

		const
			p = this.params,
			q = this.query;

		if (Object.isTable(q)) {
			if (p.headers) {
				p.headers = normalizeHeaders(p.headers, q);
			}

			url = applyQueryForStr(url, q, /\/:(.+?)(\(.*?\)|\/)/g);

		} else if (p.headers) {
			p.headers = normalizeHeaders(p.headers);
		}

		if (this.canCache) {
			this.cacheKey = getRequestKey(url, p);
		}

		if ($C(q).length()) {
			return `${url}?${toQueryString(q)}`;
		}

		return url;
	}

	/**
	 * Cache middleware for a request
	 */
	saveCache(res: RequestResponseObject<T>): RequestResponseObject<T> {
		const
			p = this.params,
			key = this.cacheKey,
			cache = this.cache;

		if (key) {
			if (p.offlineCache) {
				storage
					.set(getStorageKey(key), res.data, p.cacheTTL || (1).day())
					.catch(stderr);
			}

			if (this.cacheTimeoutId) {
				clearTimeout(this.cacheTimeoutId);
			}

			cache.set(
				key,
				res.data
			);

			if (p.cacheTTL) {
				this.cacheTimeoutId = setTimeout(() => cache.remove(key), p.cacheTTL);
			}
		}

		return res;
	}

	/**
	 * Drops the cache
	 */
	dropCache(): void {
		const
			key = this.cacheKey;

		if (key) {
			this.cache.remove(key);

			if (this.params.offlineCache) {
				storage.remove(getStorageKey(key)).catch(stderr);
			}
		}
	}

	/**
	 * Middleware for wrapping an object as RequestResponseObject
	 * @param obj
	 */
	async wrapAsResponse(obj: any): Promise<RequestResponseObject<T>> {
		const response = obj instanceof Response ? obj : new Response(obj, {
			responseType: 'object'
		});

		return {
			response,
			ctx: this,
			data: await response.decode(),
			dropCache: this.dropCache.bind(this)
		};
	}

	/**
	 * Wraps the specified promise (attaches pending cache, etc.)
	 * @param promise
	 */
	wrapRequest(promise: Then<T>): Then<T> {
		const
			key = this.cacheKey,
			cache = this.pendingCache;

		if (key && !cache.has(key)) {
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
	}
}
