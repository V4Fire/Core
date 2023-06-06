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

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';

export * from 'core/cache/interface';

/**
 * Loopback class for a cache data structure
 */
export default class NeverCache<V = any, K = any> implements Cache<V, K> {
	/** {@link Cache.size} */
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

	/** {@link Cache.has} */
	has(_key: K): boolean {
		return false;
	}

	/** {@link Cache.get} */
	get(_ey: K): undefined {
		return undefined;
	}

	/** {@link Cache.set} */
	set(_key: K, value: V): V {
		return value;
	}

	/** {@link Cache.remove} */
	remove(_key: K): CanUndef<V> {
		return undefined;
	}

	/** {@link Cache.keys} */
	keys(): IterableIterator<K> {
		return this.storage.keys();
	}

	/** {@link Cache.values} */
	values(): IterableIterator<V> {
		return this.storage.values();
	}

	/** {@link Cache.entries} */
	entries(): IterableIterator<[K, V]> {
		return this.storage.entries();
	}

	/** {@link Cache.clear} */
	clear(_filter?: ClearFilter<V, K>): Map<K, V> {
		return new Map();
	}
}
