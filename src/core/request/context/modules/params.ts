/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Cache from 'core/cache/interface';

import { merge } from 'core/request/utils';
import { cache, pendingCache, methodsWithoutBody } from 'core/request/const';

import {

	NormalizedCreateRequestOptions,
	RequestQuery,
	RequestResponse,
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
	 * String key to cache the request
	 */
	cacheKey?: string;

	/**
	 * Storage to cache the request
	 */
	readonly cache: Cache<Nullable<D>>;

	/**
	 * Storage to cache the pending request
	 */
	readonly pendingCache: Cache<RequestResponse<D>> = pendingCache;

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
	parent!: Then;

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
		this.cache = (Object.isString(p.cacheStrategy) ? cache[p.cacheStrategy] : p.cacheStrategy) ?? cache.never;
		this.canCache = p.cacheMethods.includes(p.method) || false;
	}
}
