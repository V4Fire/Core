/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/cache/never/README.md]]
 * @packageDocumentation
 */
import type Cache from '../../../core/cache/interface';
import type { ClearFilter } from '../../../core/cache/interface';
export * from '../../../core/cache/interface';
/**
 * Loopback class for a cache data structure
 */
export default class NeverCache<V = any, K = any> implements Cache<V, K> {
    /** @see [[Cache.size]] */
    get size(): number;
    /**
     * Cache object
     */
    protected readonly storage: Map<K, V>;
    [Symbol.iterator](): IterableIterator<K>;
    /** @see [[Cache.has]] */
    has(key: K): boolean;
    /** @see [[Cache.get]] */
    get(key: K): undefined;
    /** @see [[Cache.set]] */
    set(key: K, value: V): V;
    /** @see [[Cache.remove]] */
    remove(key: K): CanUndef<V>;
    /** @see [[Cache.keys]] */
    keys(): IterableIterator<K>;
    /** @see [[Cache.values]] */
    values(): IterableIterator<V>;
    /** @see [[Cache.entries]] */
    entries(): IterableIterator<[K, V]>;
    /** @see [[Cache.clear]] */
    clear(filter?: ClearFilter<V, K>): Map<K, V>;
}
