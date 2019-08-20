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

export default interface Cache<V = unknown, K = string> {
	/**
	 * Returns true if in a cache exists a value by the specified key
	 * @param key
	 */
	has(key: K): boolean;

	/**
	 * Returns a value from a cache by the specified key
	 * @param key
	 */
	get(key: K): CanUndef<V>;

	/**
	 * Saves a value to a cache by the specified key
	 *
	 * @param key
	 * @param value
	 */
	set(key: K, value: V): V;

	/**
	 * Removes a value from a cache by the specified key
	 * @param key
	 */
	remove(key: K): CanUndef<V>;

	/**
	 * Returns an iterator with cache keys
	 */
	keys(): Iterator<K>;

	/**
	 * Clears a cache by the specified filter and returns a list of the removed keys
	 * @param [filter] - filter for removing (if not defined, then the cache will be cleared)
	 */
	clear(filter?: ClearFilter<V, K>): Set<K>;
}
