/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface ClearFilter<V = unknown, K = string> {
	(el: V, key: K): unknown;
}

/**
 * Base interface for a cache data structure
 *
 * @typeparam K - key type
 * @typeparam V - value type
 */
export default interface Cache<K = unknown, V = unknown> {
	/**
	 * Number of elements within the cache
	 */
	readonly size: number;

	/**
	 * Returns true if a value by the specified key exists in the cache
	 * @param key
	 */
	has(key: K): boolean;

	/**
	 * Returns a value from the cache by the specified key
	 * @param key
	 */
	get(key: K): CanUndef<V>;

	/**
	 * Saves a value to the cache by the specified key
	 *
	 * @param key
	 * @param value
	 * @param opts
	 */
	set(key: K, value: V, opts?: {}): V;

	/**
	 * Removes a value from the cache by the specified key
	 * @param key
	 */
	remove(key: K): CanUndef<V>;

	/**
	 * Clears the cache by the specified filter and returns a map of removed keys
	 * @param [filter] - filter for removing (if not specified, then all cache values will be removed)
	 */
	clear(filter?: ClearFilter<V, K>): Map<K, V>;

	/**
	 * Clones the cache and returns a cloned one
	 */
	clone(): Cache<K, V>;

	/**
	 * Returns an iterator by the cache keys
	 */
	[Symbol.iterator](): IterableIterator<K>;

	/**
	 * Returns an iterator by the cache keys
	 */
	keys(): IterableIterator<K>;

	/**
	 * Returns an iterator by the cache values
	 */
	values(): IterableIterator<V>;

	/**
	 * Returns an iterator from the cache that produces pairs of keys and values
	 */
	entries(): IterableIterator<[K, V]>;
}
