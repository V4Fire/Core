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
	 *
	 * @param promise
	 */
	wrapRequest(promise: RequestResponse<D>): RequestResponse<D> {
		const
			key = this.cacheKey,
			cache = this.pendingCache,
			cacheVal = key != null ? cache.get(key) : null;

		const canCache =
			key != null &&
			isControllablePromise(cacheVal) &&
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

			const pendingRequest = Object.cast<ControllablePromise<RequestResponse<D>>>(
				cacheVal
			).resolve(promise);

			pendingRequest.catch(() => {
				// Loopback
			});

			void cache.set(key, pendingRequest);
		}

		return promise;
	}

	/**
	 * Middleware to cache a response object
	 *
	 * @param resObj - response object
	 */
	saveCache(resObj: RequestResponseObject<D>): Promise<RequestResponseObject<D>> {
		const
			key = this.cacheKey;

		return new SyncPromise((resolve, reject) => {
			if (key != null) {
				const save = () => {
					resObj.data
						.then((data) => {
							resolve(resObj);

							if (caches.has(this.cache)) {
								void this.cache.set(key, data);
							}
						})

						.catch(reject);
				};

				const
					{response} = resObj;

				if (response.bodyUsed) {
					save();

				} else if (!response.streamUsed) {
					const
						{emitter} = response;

					const saveAndClear = () => {
						save();

						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						emitter.off('bodyUsed', clear);
					};

					const clear = () => {
						resolve(resObj);
						emitter.off('bodyUsed', saveAndClear);
					};

					emitter.once('bodyUsed', saveAndClear);
					emitter.once('streamUsed', clear);
				}

				caches.add(this.cache);
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
			customData;

		return {
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

			dropCache: this.dropCache.bind(this)
		};
	}
}
