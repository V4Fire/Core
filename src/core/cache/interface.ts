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
 * @typeparam V - value type
 * @typeparam K - key type (`string` by default)
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
	 * @param opts
	 */
	set(key: K, value: V, opts?: DecoratorOptions): V;

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
	 * Clears the cache by the specified filter and returns a map of removed keys
	 * @param [filter] - filter for removing (if not specified, then all cache values will be removed)
	 */
	clear(filter?: ClearFilter<V, K>): Map<K, V>;
}

export type PersistentCache<V = unknown, K = string> = {
	[key in (keyof Cache<V, K>)]: ReturnPromise<Cache<V, K>[key]>
};

export interface TTLCache<V = unknown, K = string> extends Cache<V, K> {
	/**
	 * Removes the `ttl` descriptor from a cache item by the specified key.
	 * The method returns `true` if the operation has been successful, otherwise `false`
	 * (the requested item hasn't been found).
	 *
	 * @param key
	 */
	removeTTLFrom(key: K): boolean;
}

export interface DecoratorOptions {
	/**
	 * Time to expire a cache item in persistent storage
	 */
	persistentTTL?: number;
	/**
	 * Time to expire a cache item in milliseconds
	 */
	ttl?: number;
}

export interface PersistentOptions {
    persistentTTL?: number;
    readFromMemoryStrategy: 'always' | 'connectionLoss';
    initializationStrategy: 'lazy' | 'semi-lazy' | 'active';
}
