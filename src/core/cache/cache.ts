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

export default class Cache<V = unknown, K = string> {
	/**
	 * Cache object
	 */
	protected readonly storage: Map<K, V> = new Map();

	/**
	 * Returns true if in a cache exists a value by the specified key
	 * @param key
	 */
	has(key: K): boolean {
		return this.storage.has(key);
	}

	/**
	 * Returns a value from a cache by the specified key
	 * @param key
	 */
	get(key: K): CanUndef<V> {
		return this.storage.get(key);
	}

	/**
	 * Saves a value to a cache by the specified key
	 *
	 * @param key
	 * @param value
	 */
	set(key: K, value: V): V {
		this.storage.set(key, value);
		return value;
	}

	/**
	 * Removes a value from a cache by the specified key
	 * @param key
	 */
	remove(key: K): CanUndef<V> {
		if (this.has(key)) {
			const val = this.storage.get(key);
			this.storage.delete(key);
			return val;
		}
	}

	/**
	 * Returns an iterator with cache keys
	 */
	keys(): Iterator<K> {
		return this.storage.keys();
	}

	/**
	 * Clears a cache by the specified filter and returns a list of the removed keys
	 * @param [filter] - filter for removing (if not defined, then the cache will be cleared)
	 */
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
