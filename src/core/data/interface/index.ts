/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/interface/README.md]]
 * @packageDocumentation
 */

import type { EventEmitterLike } from 'core/async';
import type { CreateRequestOptions, RequestQuery, RequestMethod, RequestResponse, RequestBody } from 'core/request';
import type { ModelMethod } from 'core/data/interface/types';

export * from 'core/data/interface/types';

/**
 * Base interface of a data provider
 */
export interface Provider {
	/**
	 * Full name of the provider including a namespace
	 */
	readonly providerName: string;

	/**
	 * Provider alias
	 */
	readonly alias?: string;

	/**
	 * Event emitter to broadcast provider events
	 */
	readonly emitter: EventEmitterLike;

	/**
	 * @deprecated
	 * @see [[Provider.emitter]]
	 */
	readonly event: EventEmitterLike;

	/**
	 * Returns a custom logical name of any request.
	 * If a request has the name, then it will fire an event with the same name after successful receiving.
	 */
	name(): CanUndef<ModelMethod>;

	/**
	 * Sets a custom logical name for any request.
	 * If a request has the name, then it will fire an event with the same name after successful receiving.
	 * This method returns a new provider object with context.
	 *
	 * @param [value]
	 */
	name(value: ModelMethod): Provider;

	/**
	 * Returns a custom HTTP request method of any request
	 */
	method(): CanUndef<RequestMethod>;

	/**
	 * Sets a custom HTTP request method for any request.
	 * This method returns a new provider object with context.
	 *
	 * @param [value]
	 */
	method(value: RequestMethod): Provider;

	/**
	 * Returns a base part of URL of any request
	 */
	base(): string;

	/**
	 * Sets a base part of URL for any request.
	 * This method returns a new provider object with context.
	 *
	 * @param [value]
	 */
	base(value: string): Provider;

	/**
	 * Returns full URL of any request
	 */
	url(): string;

	/**
	 * Sets an extra URL part for any request (it is concatenated with the base part of URL).
	 * This method returns a new provider object with context.
	 *
	 * @param [value]
	 */
	url(value: string): Provider;

	/**
	 * Drops the request cache of the current provider
	 */
	dropCache(): void;

	/**
	 * Requests the provider for data by a query.
	 * This method is similar for a GET request.
	 *
	 * @param [query] - request query
	 * @param [opts] - additional request options
	 */
	get<D = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<D>): RequestResponse<D>;

	/**
	 * Checks accessibility of the provider by a query.
	 * This method is similar for a HEAD request.
	 *
	 * @param [query] - request query
	 * @param [opts] - additional request options
	 */
	peek<D = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<D>): RequestResponse<D>;

	/**
	 * Sends custom data to the provider without any logically effect.
	 * This method is similar for a POST request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 */
	post<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestResponse<D>;

	/**
	 * Add new data to the provider.
	 * This method is similar for a POST request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 * @emits `add<T>(data: () => T)`
	 */
	add<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestResponse<D>;

	/**
	 * Updates data of the provider by a query.
	 * This method is similar for a PUT request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 * @emits `upd<T>(data: () => T)`
	 */
	upd<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestResponse<D>;

	/**
	 * Deletes data of the provider by a query.
	 * This method is similar for a DELETE request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 * @emits `del<T>(data: () => T)`
	 */
	del<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestResponse<D>;
}
