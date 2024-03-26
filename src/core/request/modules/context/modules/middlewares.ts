/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

import SyncPromise from 'core/promise/sync';
import { isControllablePromise, ControllablePromise } from 'core/promise';

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
		const {
			cacheKey,
			pendingCache
		} = this;

		const cacheVal = cacheKey != null ?
			pendingCache.get(cacheKey) :
			null;

		const canCache =
			cacheKey != null &&
			isControllablePromise(cacheVal) &&
			this.params.engine.pendingCache !== false;

		if (canCache) {
			promise = promise.then(
				(res) => {
					void pendingCache.remove(cacheKey);
					return res;
				},

				(reason) => {
					void pendingCache.remove(cacheKey);
					throw reason;
				},

				() => {
					void pendingCache.remove(cacheKey);
				}
			);

			const pendingRequest = Object.cast<ControllablePromise<RequestResponse<D>>>(
				cacheVal
			).resolve(promise);

			pendingRequest.catch(() => {
				// Loopback
			});

			void pendingCache.set(cacheKey, pendingRequest);
		}

		return promise;
	}

	/**
	 * Middleware to cache a response object
	 * @param requestResponse
	 */
	saveCache(requestResponse: RequestResponseObject<D>): Promise<RequestResponseObject<D>> {
		const {
			cacheKey,
			cache
		} = this;

		return new SyncPromise((resolve, reject) => {
			if (cacheKey != null) {
				const saveCache = () => {
					requestResponse.data
						.then((data) => {
							resolve(requestResponse);

							if (caches.has(cache)) {
								void cache.set(cacheKey, data);
							}
						})

						.catch(reject);
				};

				const
					{response} = requestResponse;

				if (response.bodyUsed) {
					saveCache();

				} else if (!response.streamUsed) {
					const
						{emitter} = response;

					const saveCacheAndClear = () => {
						saveCache();

						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						emitter.off('bodyUsed', clear);
					};

					const clear = () => {
						resolve(requestResponse);
						emitter.off('bodyUsed', saveCacheAndClear);
					};

					emitter.once('bodyUsed', saveCacheAndClear);
					emitter.once('streamUsed', clear);
				}

				caches.add(cache);
			}
		});
	}

	/**
	 * A middleware to wrap the specified response value with `RequestResponseObject`.
	 * Use it when wrapping some raw data as the `core/request` response.
	 *
	 * @param value
	 */
	wrapAsResponse(value: Response<D> | ResponseTypeValue): RequestResponseObject<D> {
		const response = value instanceof Response ?
			value :

			new Response<D>(value, {
				parent: this.parent,
				responseType: 'object'
			});

		let
			customData: Nullable<Promise<D>>,
			destroyed = false;

		const res = {
			ctx: this,
			response,

			get data() {
				return customData ?? response.decode();
			},

			set data(val: Promise<D>) {
				customData = SyncPromise.resolve(val);
			},

			get stream() {
				return response.decodeStream();
			},

			emitter: new EventEmitter({maxListeners: 100}),
			[Symbol.asyncIterator]: response[Symbol.asyncIterator].bind(response),

			dropCache: this.dropCache.bind(this),

			destroy: () => {
				if (destroyed) {
					return;
				}

				this.destroy();
				res.emitter.removeAllListeners();

				Object.set(res, 'ctx', null);

				response.destroy();
				customData = undefined;

				res.dropCache = () => undefined;
				destroyed = true;
			}
		};

		return res;
	}
}
