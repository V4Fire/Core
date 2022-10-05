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
	/** @see {@link Cache.size} */
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

	/** @inheritDoc */
	has(_key: K): boolean {
		return false;
	}

	/** @inheritDoc */
	get(_key: K): undefined {
		return undefined;
	}

	/** @inheritDoc */
	set(key: K, value: V): V {
		return value;
	}

	/** @inheritDoc */
	remove(_key: K): CanUndef<V> {
		return undefined;
	}

	/** @inheritDoc */
	keys(): IterableIterator<K> {
		return this.storage.keys();
	}

	/** @inheritDoc */
	values(): IterableIterator<V> {
		return this.storage.values();
	}

	/** @inheritDoc */
	entries(): IterableIterator<[K, V]> {
		return this.storage.entries();
	}

	/** @inheritDoc */
	clear(_filter?: ClearFilter<V, K>): Map<K, V> {
		return new Map();
	}
}
