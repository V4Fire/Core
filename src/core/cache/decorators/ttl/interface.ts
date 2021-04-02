/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';

export interface TTLCache<V = unknown, K = string, T extends Cache<V, K> = Cache<V, K>> extends Cache<V, K> {
	/**
	 * Saves a value to the cache by the specified key
	 *
	 * @param key
	 * @param value
	 * @param [opts] - additional options
	 */
	set(key: K, value: V, opts?: TTLDecoratorOptions & Parameters<T['set']>[2]): V;

	/**
	 * Removes the `ttl` descriptor from a cache item by the specified key.
	 * The method returns `true` if the operation has been successful, otherwise `false`
	 * (the requested item hasn't been found).
	 *
	 * @param key
	 */
	removeTTLFrom(key: K): boolean;
}

export interface TTLDecoratorOptions {
	/**
	 * Time to expire a cache item in milliseconds
	 */
	ttl?: number;
}

