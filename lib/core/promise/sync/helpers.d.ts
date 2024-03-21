/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { PromiseLikeP } from '../../../core/async';
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
 * memoize('core/url/concat', () => import('../../../core/url/concat'));
 * ```
 */
export declare function memoize<T = unknown>(keyOrPromise: unknown | PromiseLikeP<T>, promise?: PromiseLikeP<T>): Promise<T>;
