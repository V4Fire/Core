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

import { EventEmitterLike } from 'core/async';
import { CreateRequestOptions, RequestQuery, RequestMethod, RequestResponse, RequestBody } from 'core/request';
import { ModelMethod } from 'core/data/interface';
export * from 'core/data/interface/types';

/**
 * Base interface of a data provider
 */
export default interface Provider {
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
	 * @see [[Provider.prototype.emitter]]
	 */
	readonly event: EventEmitterLike

	/**
	 * Returns a custom logical name of any request.
	 * If a request have the name, then it will fires an event with the same name after successful receiving.
	 */
	name(): CanUndef<ModelMethod>;

	/**
	 * Sets a custom logical name for any request.
	 * If a request have the name, then it will fires an event with the same name after successful receiving.
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
	 * Returns the full URL of any request
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
	 * Drops the cache of requests for this provider
	 */
	dropCache(): void;

	/**
	 * Requests the provider for a data by a query.
	 * This method is similar for a GET request.
	 *
	 * @param [query] - request query
	 * @param [opts] - additional request options
	 */
	get<T = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<T>): RequestResponse;

	/**
	 * Checks accessibility of the provider by a query.
	 * This method is similar for a HEAD request.
	 *
	 * @param [query] - request query
	 * @param [opts] - additional request options
	 */
	peek<T = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<T>): RequestResponse;

	/**
	 * Sends custom data to the provider without any logically effect.
	 * This method is similar for a POST request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 */
	post<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse;

	/**
	 * Add new data to the provider.
	 * This method is similar for a POST request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 * @emits `add<T>(data: () => T)`
	 */
	add<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse;

	/**
	 * Updates data of the provider by a query.
	 * This method is similar for a PUT request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 * @emits `upd<T>(data: () => T)`
	 */
	upd<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse ;

	/**
	 * Deletes data of the provider by a query.
	 * This method is similar for a DELETE request.
	 *
	 * @param [body] - request body
	 * @param [opts] - additional request options
	 * @emits `del<T>(data: () => T)`
	 */
	del<T = unknown>(body?: RequestBody, opts?: CreateRequestOptions<T>): RequestResponse;
}
