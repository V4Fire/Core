/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/promise/memoize/README.md]]
 * @packageDocumentation
 */

import SyncPromise from 'core/promise/sync';
import type { PromiseLikeP } from 'core/async';

import { weakMemoizeCache, longMemoizeCache } from 'core/promise/memoize/const';

/**
 * Memorizes the specified promise and converts it to a synchronous promise.
 * It means that after the first resolution,
 * the promised result will be cached, and the method returns the synchronous version of a promise.
 *
 * @param keyOrPromise - promise or a promise factory to cache, or a key to cache the promise
 * @param promise - promise or a promise factory to cache (if the first argument is a key)
 *
 * @example
 * ```
 * memoize(nextTick());
 * memoize('core/url/concat', () => import('core/url/concat'));
 * ```
 */
export function memoize<T>(keyOrPromise: unknown | PromiseLikeP, promise?: PromiseLikeP): Promise<T> {
	return new SyncPromise((resolve, reject) => {
		if (keyOrPromise != null && typeof keyOrPromise === 'object') {
			if (weakMemoizeCache.has(keyOrPromise!)) {
				return resolve(weakMemoizeCache.get(keyOrPromise!));
			}

		} else if (Object.isPrimitive(keyOrPromise) && longMemoizeCache.has(keyOrPromise)) {
			return resolve(longMemoizeCache.get(keyOrPromise));
		}

		let p = promise ?? keyOrPromise;
		p = Object.isFunction(p) ? p() : p;

		if (!Object.isPromise(p)) {
			throw new ReferenceError('A promise to wait is not found');
		}

		p
			.then((val) => {
				if (keyOrPromise != null && typeof keyOrPromise === 'object') {
					weakMemoizeCache.set(keyOrPromise!, val);

				} else {
					longMemoizeCache.set(keyOrPromise, val);
				}

				resolve(val);
			})

			.catch(reject);
	});
}
