/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Response, { ResponseTypeValue } from 'core/request/response';
import { getStorageKey } from 'core/request/utils';

import { storage } from 'core/request/const';
import { RequestResponse, RequestResponseObject } from 'core/request/interface';

import Super from 'core/request/context/modules/methods';

export default class RequestContext<D = unknown> extends Super<D> {
	/**
	 * Wraps the specified promise: attaches the pending cache, etc.
	 * @param promise
	 */
	wrapRequest(promise: RequestResponse<D>): RequestResponse<D> {
		const
			key = this.cacheKey,
			cache = this.pendingCache;

		if (key != null && !cache.has(key)) {
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
	 * Middleware to cache a request
	 * @param res - response object
	 */
	saveCache(res: RequestResponseObject<D>): RequestResponseObject<D> {
		const
			p = this.params,
			key = this.cacheKey;

		const
			{cache} = this;

		if (key != null) {
			if (p.offlineCache) {
				if (!storage) {
					throw new ReferenceError("kv-storage module isn't loaded");
				}

				storage
					.then((storage) => storage.set(getStorageKey(key), res.data, p.offlineCacheTTL))
					.catch(stderr);
			}

			if (this.cacheTimeoutId != null) {
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
			response,
			ctx: this,
			data: await response.decode(),
			dropCache: this.dropCache.bind(this)
		};
	}
}
