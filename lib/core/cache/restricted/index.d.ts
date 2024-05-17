/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/cache/restricted/README.md]]
 * @packageDocumentation
 */
import SimpleCache, { ClearFilter } from '../../../core/cache/simple';
export * from '../../../core/cache/simple';
/**
 * Implementation for an in-memory data structure with support for limiting of values in the cache
 *
 * @typeparam V - value type
 * @typeparam K - key type (`string` by default)
 */
export default class RestrictedCache<V = unknown, K = string> extends SimpleCache<V, K> {
    /**
     * Queue object
     */
    protected readonly queue: Set<K>;
    /**
     * Number of maximum records in the cache
     */
    protected capacity: number;
    /**
     * @override
     * @param [max] - number of maximum records in the cache
     */
    constructor(max?: number);
    get(key: K): CanUndef<V>;
    set(key: K, value: V): V;
    remove(key: K): CanUndef<V>;
    clear(filter?: ClearFilter<V, K>): Map<K, V>;
    /**
     * Sets a new capacity of the cache.
     * The method returns a map of truncated elements that the cache can't fit anymore.
     *
     * @param value
     */
    setCapacity(value: number): Map<K, V>;
}
