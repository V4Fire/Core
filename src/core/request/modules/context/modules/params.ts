/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type AbortablePromise from 'core/promise/abortable';
import type { AbstractCache } from 'core/cache';

import symbolGenerator from 'core/symbol';
import addTTL from 'core/cache/decorators/ttl';
import addPersistent from 'core/cache/decorators/persistent';

import {

	storage,

	cache,
	pendingCache,
	caches,

	methodsWithoutBody

} from 'core/request/const';

import Headers from 'core/request/headers';
import { merge } from 'core/request/helpers';

import type {

	NormalizedCreateRequestOptions,
	RequestQuery,
	RequestResponse,
	WrappedDecoders,
	WrappedEncoders

} from 'core/request/interface';

export const
	$$ = symbolGenerator();

export default class RequestContext<D = unknown> {
	/**
	 * Promise that resolves when the instance is already initialized
	 */
	readonly isReady: Promise<void>;

	/**
	 * True if the request can be cached
	 */
	readonly canCache: boolean;

	/**
	 * String key to cache the request
	 */
	get cacheKey(): CanUndef<string> {
		return this[$$.cacheKey];
	}

	/**
	 * Sets a new string key to cache the request
	 */
	protected set cacheKey(value: CanUndef<string>) {
		this[$$.cacheKey] = value;
	}

	/**
	 * Storage to cache the resolved request
	 */
	readonly cache!: AbstractCache<Nullable<D>>;

	/**
	 * Storage to cache the request while it is pending a response
	 */
	readonly pendingCache: AbstractCache<RequestResponse<D>> = Object.cast(pendingCache);

	/**
	 * True if the request can provide parameters only as a query string
	 */
	readonly withoutBody: boolean;

	/**
	 * Request parameters
	 */
	readonly params!: NormalizedCreateRequestOptions<D>;

	/**
	 * Alias for `params.query`
	 * @alias
	 */
	get query(): RequestQuery {
		return this.params.query;
	}

	/**
	 * Alias for `params.headers`
	 * @alias
	 */
	get headers(): Headers {
		return this.params.headers;
	}

	/**
	 * Sequence of request data encoders
	 */
	get encoders(): WrappedEncoders {
		return this[$$.encoders];
	}

	/**
	 * Sets a new sequence of request data encoders
	 */
	protected set encoders(value: WrappedEncoders) {
		this[$$.encoders] = value;
	}

	/**
	 * Sequence of response data decoders
	 */
	get decoders(): WrappedDecoders {
		return this[$$.decoders];
	}

	/**
	 * Sets a new sequence of response data decoders
	 */
	protected set decoders(value: WrappedDecoders) {
		this[$$.decoders] = value;
	}

	/**
	 * Link to a parent operation promise
	 */
	parent!: AbortablePromise;

	/**
	 * Cache TTL identifier
	 */
	protected cacheTimeoutId?: number;

	/**
	 * @param [params] - request parameters
	 */
	constructor(params?: NormalizedCreateRequestOptions<D>) {
		const
			p = merge<NormalizedCreateRequestOptions<D>>({}, params);

		p.headers = new Headers(p.headers);
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

		let cacheAPI =
			(
				Object.isString(p.cacheStrategy) ?
					cache[p.cacheStrategy] :
					p.cacheStrategy
			) ??

			cache.never;

		this.isReady = (async () => {
			// eslint-disable-next-line require-atomic-updates
			cacheAPI = await cacheAPI;

			if (p.cacheTTL != null) {
				cacheAPI = addTTL(cacheAPI, p.cacheTTL);
			}

			if (p.offlineCache === true && storage != null) {
				const storageAPI = await storage;

				// eslint-disable-next-line require-atomic-updates
				cacheAPI = await addPersistent(cacheAPI, storageAPI, {
					persistentTTL: p.offlineCacheTTL,
					loadFromStorage: 'onOfflineDemand'
				});
			}

			Object.set(this, 'cache', cacheAPI);
			caches.add(cacheAPI);
		})();
	}
}
