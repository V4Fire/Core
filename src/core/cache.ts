/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

export interface ClearFilter<V = any, K = string> {
	(el: V, key: K): any;
}

/**
 * Class for caching
 */
export class Cache<V = any, K = string> {
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
	get(key: K): V {
		if (!this.has(key)) {
			throw Error(`${key} is not exist`);
		}

		return <any>this.storage.get(key);
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
	remove(key: K): V | undefined {
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
				removed = new Set();

			$C(this.storage).remove((el, key) => {
				if (filter(el, key)) {
					removed.add(key);
					return true;
				}
			});

			return removed;
		}

		const
			// @ts-ignore
			removed = new Set(...this.storage.keys());

		this.storage.clear();
		return removed;
	}
}

/**
 * Class for restricted caching
 */
export class RestrictedCache<V = any, K = string> extends Cache<V, K> {
	/**
	 * Queue object
	 */
	protected readonly queue: Set<K> = new Set();

	/**
	 * Number of maximum records in a cache
	 */
	protected max: number = 20;

	/**
	 * @override
	 * @param [max] - number of maximum records in a cache
	 */
	constructor(max?: number) {
		super();

		if (max) {
			this.max = max;
		}
	}

	/** @override */
	get(key: K): V {
		if (this.has(key)) {
			this.queue.delete(key);
			this.queue.add(key);
		}

		return super.get(key);
	}

	/** @override */
	set(key: K, value: V): V {
		this.remove(key);

		if (this.queue.size === this.max) {
			const
				key = $C(this.queue).one.get();

			if (key !== undefined) {
				this.remove(key);
			}
		}

		this.queue.add(key);
		return super.set(key, value);
	}

	/** @override */
	remove(key: K): V | undefined {
		if (this.has(key)) {
			this.queue.delete(key);
			return super.remove(key);
		}
	}

	/** @override */
	clear(filter?: ClearFilter<V, K>): Set<K> {
		const removed = super.clear();
		$C(this.queue).remove((el) => removed.has(el));
		return removed;
	}
}
