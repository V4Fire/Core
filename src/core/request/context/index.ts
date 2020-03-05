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

import Then from 'core/then';
import Cache from 'core/cache/interface';

import { deprecated } from 'core/functools';
import { concatUrls, toQueryString } from 'core/url';

import Response, { ResponseTypeValue } from 'core/request/response';
import { normalizeHeaders, applyQueryForStr, getStorageKey, getRequestKey } from 'core/request/utils';
import { cache, pendingCache, storage, globalOpts, methodsWithoutBody } from 'core/request/const';
import { queryTplRgxp, resolveURLRgxp } from 'core/request/context/const';

import {

	NormalizedCreateRequestOptions,
	RequestQuery,
	RequestAPI,
	RequestResponseObject,
	WrappedDecoders,
	WrappedEncoders

} from 'core/request/interface';

export default class RequestContext<D = unknown> {
	/**
	 * True if a host has connection to the internet
	 */
	isOnline: boolean = false;

	/**
	 * True if the request can be cached
	 */
	readonly canCache: boolean;

	/**
	 * Cache key of the request
	 */
	cacheKey?: string;

	/**
	 * Cache object
	 */
	readonly cache: Cache;

	/**
	 * Cache object for pending requests
	 */
	readonly pendingCache: Cache = pendingCache;

	/**
	 * True if the request can provide parameters only as a query string
	 */
	readonly withoutBody: boolean;

	/**
	 * Request parameters
	 */
	readonly params!: NormalizedCreateRequestOptions<D>;

	/**
	 * Sequence of request encoders
	 */
	encoders: WrappedEncoders;

	/**
	 * Sequence of response decoders
	 */
	decoders: WrappedDecoders;

	/**
	 * Parent operation promise
	 */
	readonly parent!: Then;

	/**
	 * Alias for query parameters of the request
	 */
	get query(): RequestQuery {
		return this.params.query;
	}

	/**
	 * Cache timeout id (for setTimeout)
	 */
	protected cacheTimeoutId?: number;

	/**
	 * @param [params] - request parameters
	 */
	constructor(params?: NormalizedCreateRequestOptions<D>) {
		const p = this.params = Object.mixin({
			deep: true,
			concatArray: true,
			concatFn: (a: unknown[], b: unknown[]) => a.union(b),
			extendFilter: (d, v) => Array.isArray(v) || Object.isPlainObject(v)
		}, {}, params);

		this.canCache = p.cacheMethods?.includes(p.method) || false;
		this.withoutBody = Boolean(methodsWithoutBody[p.method]);
		this.encoders = p.encoder ? Object.isFunction(p.encoder) ? [p.encoder] : p.encoder : [];
		this.decoders = p.decoder ? Object.isFunction(p.decoder) ? [p.decoder] : p.decoder : [];
		this.cache = cache[p.cacheStrategy] || cache.never;
	}

	/**
	 * Generates a string cache key for specified url and returns it
	 * @param url
	 */
	getRequestKey(url: string): string {
		const p = this.params;
		return [getRequestKey(url, this.params), p.cacheStrategy, p.cacheId || ''].join();
	}

	/**
	 * Returns an absolute URL for the request API
	 * @param [apiURL] - base API URL
	 */
	resolveAPI(apiURL: Nullable<string> = globalOpts.api): string {
		const
			compute = (v) => Object.isFunction(v) ? v() : v,
			api = <{[K in keyof RequestAPI]: Nullable<string>}>({...this.params.api});

		for (let keys = Object.keys(api), i = 0; i < keys.length; i++) {
			const key = keys[i];
			api[key] = compute(api[key]);
		}

		if (api.url) {
			return api.url;
		}

		const resolve = (name, def?) => {
			const
				val = api[name] != null ? api[name] : def || '';

			switch (name) {
				case 'auth':
					return val ? `${val}@` : '';

				case 'port':
					return val ? `:${val}` : '';

				default:
					return val;
			}
		};

		const resolveDomains = ({def = [], slice = 0, join = true} = {}) => {
			const
				list = Array.from({length: 6}, (el, i) => i + 1).slice(slice).reverse(),
				url = <string[]>[];

			for (let i = 0; i < list.length; i++) {
				const
					lvl = list[i],
					domain = (lvl === 1 ? api.zone : api[`domain${lvl}`]) || def[lvl - 1];

				if (domain) {
					url.push(domain);
				}
			}

			return join !== false ? url.join('.') : url;
		};

		if (!apiURL) {
			const
				nm = api.namespace || '';

			if (!api.protocol) {
				return nm[0] === '/' ? nm : `/${nm}`;
			}

			return concatUrls(
				resolve('protocol') +
					resolve('auth') +
					resolveDomains() +
					resolve('port'),

				nm
			);
		}

		if (!resolveURLRgxp.test(apiURL)) {
			return concatUrls(...resolveDomains({slice: 2, join: false}), resolve('namespace'));
		}

		return apiURL.replace(resolveURLRgxp, (str, protocol, auth, domains, port, nm) => {
			domains = domains?.split('.').reverse();
			nm = resolve('namespace', nm);

			if (!protocol) {
				return concatUrls(...resolveDomains({slice: 2, join: false}), nm);
			}

			return concatUrls(
				resolve('protocol', protocol) +
					resolve('auth', auth) +
					resolveDomains({def: domains}) +
					resolve('port', port),

				nm
			);
		});
	}

	/**
	 * Resolves request parameters and returns an absolute URL for the request
	 * @param [url] - base request URL
	 */
	resolveRequest(url?: Nullable<string>): string {
		if (url == null) {
			url = '';

		} else {
			const
				p = this.params,
				q = this.query;

			const data = this.withoutBody ?
				q : Object.isPlainObject(p.body) ? p.body : q;

			if (Object.isPlainObject(data)) {
				if (p.headers) {
					p.headers = normalizeHeaders(p.headers, data);
				}

				url = applyQueryForStr(url, data, queryTplRgxp);

			} else if (p.headers) {
				p.headers = normalizeHeaders(p.headers);
			}

			if (Object.size(q)) {
				url = `${url}?${toQueryString(q)}`;
			}

			if (this.canCache) {
				this.cacheKey = this.getRequestKey(url);
			}
		}

		return this.params.url = url;
	}

	/**
	 * Returns an absolute URL for the request
	 *
	 * @see [[RequestContext.resolveRequest]]
	 * @param [url] - base request URL
	 */
	@deprecated({renamedTo: 'resolveRequest'})
	resolveURL(url?: Nullable<string>): string {
		return this.resolveRequest(url);
	}

	/**
	 * Wraps the specified promise (attaches the pending cache, etc.)
	 * @param promise
	 */
	wrapRequest(promise: Then<D>): Then<D> {
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

		return promise;
	}

	/**
	 * Drops a value of the request from the cache
	 */
	dropCache(): void {
		const
			key = this.cacheKey;

		if (key) {
			this.cache.remove(key);

			if (this.params.offlineCache && storage) {
				storage.then((storage) => storage.remove(getStorageKey(key))).catch(stderr);
			}
		}
	}

	/**
	 * Middleware to save a request in the cache
	 * @param res - response object
	 */
	saveCache(res: RequestResponseObject<D>): RequestResponseObject<D> {
		const
			p = this.params,
			key = this.cacheKey,
			cache = this.cache;

		if (key) {
			if (p.offlineCache) {
				if (!storage) {
					throw new ReferenceError('kv-storage module is not loaded');
				}

				storage
					.then((storage) => storage.set(getStorageKey(key), res.data, p.offlineCacheTTL))
					.catch(stderr);
			}

			if (this.cacheTimeoutId) {
				clearTimeout(this.cacheTimeoutId);
			}

			cache.set(
				key,
				res.data
			);

			if (Object.isNumber(p.cacheTTL)) {
				this.cacheTimeoutId = <any>setTimeout(() => cache.remove(key), p.cacheTTL);
			}
		}

		return res;
	}

	/**
	 * Middleware to wrap the specified object with RequestResponseObject
	 * @param obj
	 */
	async wrapAsResponse(obj: Response<D> | ResponseTypeValue): Promise<RequestResponseObject<D>> {
		const response = obj instanceof Response ? obj : new Response<D>(obj, {
			parent: this.parent,
			responseType: 'object'
		});

		return {
			response,
			ctx: this,
			data: await response.decode(),
			dropCache: this.dropCache.bind(this)
		};
	}
}
