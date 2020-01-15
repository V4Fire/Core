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
 */
export default interface Cache<V = unknown, K = string> {
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
	 */
	set(key: K, value: V): V;

	/**
	 * Removes a value from the cache by the specified key
	 * @param key
	 */
	remove(key: K): CanUndef<V>;

	/**
	 * Returns an iterator by the cache keys
	 */
	keys(): Iterator<K>;

	/**
	 * Clears the cache by the specified filter and returns a list of removed keys
	 * @param [filter] - filter for removing (if not specified, then all cache values will be removed)
	 */
	clear(filter?: ClearFilter<V, K>): Set<K>;
}
