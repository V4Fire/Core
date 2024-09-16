/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ClearFilter } from 'core/cache/interface';

/**
 * Base interface for an async cache data structure
 *
 * @typeparam V - value type
 * @typeparam K - key type (`string` by default)
 */
export default interface AsyncCache<V = unknown, K = string> {
	/**
	 * Number of elements within the cache
	 */
	readonly size: Promise<number>;

	/**
	 * Returns true if a value by the specified key exists in the cache
	 * @param key
	 */
	has(key: K): Promise<boolean>;

	/**
	 * Returns a value from the cache by the specified key
	 * @param key
	 */
	get(key: K): Promise<CanUndef<V>>;

	/**
	 * Saves a value to the cache by the specified key
	 *
	 * @param key
	 * @param value
	 * @param opts
	 */
	set(key: K, value: V, opts?: {}): Promise<V>;

	/**
	 * Removes a value from the cache by the specified key
	 * @param key
	 */
	remove(key: K): Promise<CanUndef<V>>;

	/**
	 * Clears the cache by the specified filter and returns a map of removed keys
	 * @param [filter] - filter for removing (if not specified, then all cache values will be removed)
	 */
	clear(filter?: ClearFilter<V, K>): Promise<Map<K, V>>;

	/**
	 * Returns an iterator by the cache keys
	 */
	[Symbol.asyncIterator](): Promise<AsyncIterableIterator<K> | IterableIterator<K>>;

	/**
	 * Returns an iterator by the cache keys
	 */
	keys(): Promise<AsyncIterableIterator<K> | IterableIterator<K>>;

	/**
	 * Returns an iterator by the cache values
	 */
	values(): Promise<AsyncIterableIterator<V> | IterableIterator<V>>;

	/**
	 * Returns an iterator from the cache that produces pairs of keys and values
	 */
	entries(): Promise<AsyncIterableIterator<[K, V]> | IterableIterator<[K, V]>>;
}
