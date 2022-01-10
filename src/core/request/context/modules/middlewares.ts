/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Response, { ListenerFn, ResponseTypeValue } from 'core/request/response';
import { caches } from 'core/request/const';

import Super from 'core/request/context/modules/methods';
import type { RequestResponse, RequestResponseObject, RequestChunk } from 'core/request/interface';

export default class RequestContext<D = unknown> extends Super<D> {
	/**
	 * Wraps the specified promise: attaches the pending cache, etc.
	 * @param promise
	 */
	wrapRequest(promise: RequestResponse<D>): RequestResponse<D> {
		const
			key = this.cacheKey,
			cache = this.pendingCache;

		const canCache =
			key != null &&
			!cache.has(key) &&
			this.params.engine.pendingCache !== false;

		if (canCache) {
			promise = promise.then(
				(v) => {
					void cache.remove(key);
					return v;
				},

				(r) => {
					void cache.remove(key);
					throw r;
				},

				() => {
					void cache.remove(key);
				}
			);

			void cache.set(key, promise);
		}

		return promise;
	}

	/**
	 * Middleware to cache a request
	 * @param res - response object
	 */
	saveCache(res: RequestResponseObject<D>): RequestResponseObject<D> {
		const
			key = this.cacheKey;

		if (key != null) {
			void this.cache.set(key, res.data);
			caches.add(this.cache);
		}

		return res;
	}

	/**
	 * Middleware to wrap the specified response value with RequestResponseObject
	 * @param value
	 */
	async wrapAsResponse(value: Response<D> | ResponseTypeValue): Promise<RequestResponseObject<D>> {
		const response = value instanceof Response ?
			value :

			new Response<D>(value, {
				parent: this.parent,
				responseType: 'object'
			});

		return {
			on(eventName: string, listener: ListenerFn): void {
				response.on(eventName, listener);
			},
			[Symbol.asyncIterator](): AsyncGenerator<RequestChunk> {
				return response[Symbol.asyncIterator]();
			},
			response,
			ctx: this,
			data: await response.decode(),
			dropCache: this.dropCache.bind(this)
		};
	}
}
