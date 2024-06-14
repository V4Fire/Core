/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type AbortablePromise from 'core/promise/abortable';
import type { ControllablePromise } from 'core/promise';
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

	WrappedEncoders,
	WrappedDecoders,
	WrappedStreamDecoders

} from 'core/request/interface';

export const
	$$ = symbolGenerator();

const
	cacheStore = Object.createDict<WeakMap<AbstractCache, AbstractCache>>();

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
	readonly cache!: AbstractCache<string, Nullable<D>>;

	/**
	 * Storage to cache the request while it is pending a response
	 */
	readonly pendingCache: AbstractCache<string,
		ControllablePromise<RequestResponse<D>> | RequestResponse<D>
	> = Object.cast(pendingCache);

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
	 * Sequence of response data decoders
	 */
	get streamDecoders(): WrappedStreamDecoders {
		return this[$$.streamDecoders];
	}

	/**
	 * Sets a new sequence of response data decoders
	 */
	protected set streamDecoders(value: WrappedStreamDecoders) {
		this[$$.streamDecoders] = value;
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

		if (p.streamDecoder == null) {
			this.streamDecoders = [];

		} else {
			this.streamDecoders = Object.isFunction(p.streamDecoder) ? [p.streamDecoder] : p.streamDecoder;
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
				const wrap = () => addTTL(cacheAPI, p.cacheTTL);

				// eslint-disable-next-line require-atomic-updates
				cacheAPI = await getWrappedCache(`ttl.${p.cacheTTL}`, wrap);
			}

			if (p.offlineCache === true && storage != null) {
				const storageAPI = await storage;

				const wrap = () => addPersistent(cacheAPI, storageAPI, {
					persistentTTL: p.offlineCacheTTL,
					loadFromStorage: 'onOfflineDemand'
				});

				// eslint-disable-next-line require-atomic-updates
				cacheAPI = await getWrappedCache(`persistent.${p.offlineCacheTTL}`, wrap);
			}

			Object.set(this, 'cache', cacheAPI);
			caches.add(cacheAPI);

			async function getWrappedCache<T>(key: string, wrap: () => CanPromise<T>): Promise<T> {
				cacheStore[key] ??= new WeakMap();

				const
					store = cacheStore[key]!;

				if (!store.has(cacheAPI)) {
					store.set(cacheAPI, Object.cast(await wrap()));
				}

				return Object.cast(store.get(cacheAPI));
			}
		})();
	}
}
