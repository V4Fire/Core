/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Response, { ResponseTypeValue } from 'core/request/response';
import { caches } from 'core/request/const';

import Super from 'core/request/modules/context/modules/methods';
import type { RequestResponse, RequestResponseObject } from 'core/request/interface';

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
			key != null && !cache.has(key) &&
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
	 * Middleware to cache a response object
	 * @param resObj - response object
	 */
	saveCache(resObj: RequestResponseObject<D>): RequestResponseObject<D> {
		const
			key = this.cacheKey;

		if (key != null) {
			const save = () => {
				void resObj.data.then((data) => {
					if (caches.has(this.cache)) {
						void this.cache.set(key, data);
					}
				});
			};

			const
				{response} = resObj;

			if (response.bodyUsed) {
				save();

			} else if (!response.streamUsed) {
				response.emitter.once('bodyUsed', save);
			}

			caches.add(this.cache);
		}

		return resObj;
	}

	/**
	 * Middleware to wrap the specified response value with `RequestResponseObject`
	 * @param value
	 */
	wrapAsResponse(value: Response<D> | ResponseTypeValue): RequestResponseObject<D> {
		const response = value instanceof Response ?
			value :

			new Response<D>(value, {
				parent: this.parent,
				responseType: 'object'
			});

		return {
			ctx: this,
			response,

			get data() {
				return response.decode();
			},

			[Symbol.asyncIterator]: response[Symbol.asyncIterator].bind(response),
			dropCache: this.dropCache.bind(this)
		};
	}
}
