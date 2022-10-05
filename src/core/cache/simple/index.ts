/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/simple/README.md]]
 * @packageDocumentation
 */

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';

export * from 'core/cache/interface';

/**
 * Implementation for a simple in-memory cache data structure
 *
 * @typeParam V - value type
 * @typeParam K - key type (`string` by default)
 */
export default class SimpleCache<V = unknown, K = string> implements Cache<V, K> {
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
	has(key: K): boolean {
		return this.storage.has(key);
	}

	/** @inheritDoc */
	get(key: K): CanUndef<V> {
		return this.storage.get(key);
	}

	/** @inheritDoc */
	set(key: K, value: V): V {
		this.storage.set(key, value);
		return value;
	}

	/** @inheritDoc */
	remove(key: K): CanUndef<V> {
		if (this.has(key)) {
			const val = this.storage.get(key);
			this.storage.delete(key);
			return val;
		}
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
	clear(filter?: ClearFilter<V, K>): Map<K, V> {
		if (filter) {
			const
				removed = new Map<K, V>();

			for (let o = this.storage.entries(), i = o.next(); !i.done; i = o.next()) {
				const
					[key, el] = i.value;

				if (Object.isTruly(filter(el, key))) {
					removed.set(key, el);
					this.storage.delete(key);
				}
			}

			return removed;
		}

		const
			removed = new Map(this.storage.entries());

		this.storage.clear();
		return removed;
	}
}
