/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type AbortablePromise from 'core/promise/abortable';
import type { AbstractCache } from 'core/cache';

import addTTL from 'core/cache/decorators/ttl';
import addPersistent from 'core/cache/decorators/persistent';

import { merge } from 'core/request/utils';
import { storage, cache, pendingCache, caches, methodsWithoutBody } from 'core/request/const';

import type {

	NormalizedCreateRequestOptions,
	RequestQuery,
	RequestResponse,
	WrappedDecoders,
	WrappedEncoders

} from 'core/request/interface';

export default class RequestContext<D = unknown> {
	/**
	 * Promise of instance initializing
	 */
	readonly isReady: Promise<void>;

	/**
	 * True if the request can be cached
	 */
	readonly canCache: boolean;

	/**
	 * String key to cache the request
	 */
	cacheKey?: string;

	/**
	 * Storage to cache the request
	 */
	readonly cache!: AbstractCache<Nullable<D>>;

	/**
	 * Storage to cache the pending request
	 */
	readonly pendingCache: AbstractCache<RequestResponse<D>> = pendingCache;

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
	 * Link to a parent operation promise
	 */
	parent!: AbortablePromise;

	/**
	 * Alias for query parameters of the request
	 */
	get query(): RequestQuery {
		return this.params.query;
	}

	/**
	 * Cache TTL identifier
	 */
	protected cacheTimeoutId?: number;

	/**
	 * @param [params] - request parameters
	 */
	constructor(params?: NormalizedCreateRequestOptions<D>) {
		const p = merge<NormalizedCreateRequestOptions<D>>({}, params);
		this.params = p;

		if (p.encoder == null) {
			this.encoders = [];

		} else {
			this.encoders = Object.isFunction(p.encoder) ? [p.encoder] : p.encoder;
		}

		if (p.decoder == null) {
			this.decoders = [];

		} else {
			this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : p.decoder;
		}

		this.withoutBody = Boolean(methodsWithoutBody[p.method]);
		this.canCache = p.cacheMethods.includes(p.method) || false;

		let
			cacheAPI = (Object.isString(p.cacheStrategy) ? cache[p.cacheStrategy] : p.cacheStrategy) ?? cache.never;

		if (p.cacheTTL != null) {
			cacheAPI = addTTL(cacheAPI, p.cacheTTL);
		}

		this.cache = cacheAPI;

		this.isReady = (async () => {
			if (p.offlineCache === true && storage != null) {
				const storageAPI = await storage;

				// eslint-disable-next-line require-atomic-updates
				cacheAPI = await addPersistent(cacheAPI, storageAPI, {
					persistentTTL: p.offlineCacheTTL,
					loadFromStorage: 'onOfflineDemand'
				});

				Object.set(this, 'cache', cacheAPI);
			}

			caches.add(cacheAPI);
		})();
	}
}
