/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Cache, { ClearFilter } from 'core/cache/interface';
export * from 'core/cache/interface';

export default class SimpleCache<V = unknown, K = string> implements Cache<V, K> {
	/**
	 * Cache object
	 */
	protected readonly storage: Map<K, V> = new Map();

	/** @see Cache.has */
	has(key: K): boolean {
		return this.storage.has(key);
	}

	/** @see Cache.get */
	get(key: K): CanUndef<V> {
		return this.storage.get(key);
	}

	/** @see Cache.set */
	set(key: K, value: V): V {
		this.storage.set(key, value);
		return value;
	}

	/** @see Cache.remove */
	remove(key: K): CanUndef<V> {
		if (this.has(key)) {
			const val = this.storage.get(key);
			this.storage.delete(key);
			return val;
		}
	}

	/** @see Cache.keys */
	keys(): Iterator<K> {
		return this.storage.keys();
	}

	/** @see Cache.clear */
	clear(filter?: ClearFilter<V, K>): Set<K> {
		if (filter) {
			const
				removed = new Set<K>();

			for (let o = this.storage.entries(), i = o.next(); !i.done; i = o.next()) {
				const
					[key, el] = i.value;

				if (filter(el, key)) {
					removed.add(key);
					this.storage.delete(key);
				}
			}

			return removed;
		}

		const
			removed = new Set(this.storage.keys());

		this.storage.clear();
		return removed;
	}
}
