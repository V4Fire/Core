/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/never/README.md]]
 *
 * @packageDocumentation
 */

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';

export * from 'core/cache/interface';

/**
 * Loopback class for a cache data structure
 */
export default class NeverCache<V = any, K = any> implements Cache<V, K> {
	/** @see [[Cache.size]] */
	get size(): number {
		return this.storage.size;
	}

	/**
	 * Cache object
	 */
	protected readonly storage: Map<K, V> = new Map();

	[Symbol.iterator](): IterableIterator<K> {
		return this.keys();
	}

	/** @see [[Cache.has]] */
	has(_key: K): boolean {
		return false;
	}

	/** @see [[Cache.get]] */
	get(_key: K): undefined {
		return undefined;
	}

	/** @see [[Cache.set]] */
	set(_key: K, value: V): V {
		return value;
	}

	/** @see [[Cache.remove]] */
	remove(_key: K): CanUndef<V> {
		return undefined;
	}

	/** @see [[Cache.keys]] */
	keys(): IterableIterator<K> {
		return this.storage.keys();
	}

	/** @see [[Cache.values]] */
	values(): IterableIterator<V> {
		return this.storage.values();
	}

	/** @see [[Cache.entries]] */
	entries(): IterableIterator<[K, V]> {
		return this.storage.entries();
	}

	/** @see [[Cache.clear]] */
	clear(_filter?: ClearFilter<V, K>): Map<K, V> {
		return new Map();
	}
}
