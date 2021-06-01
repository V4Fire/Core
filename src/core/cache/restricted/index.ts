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

import SimpleCache, { ClearFilter } from 'core/cache/simple';

export * from 'core/cache/simple';

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
	protected readonly queue: Set<K> = new Set();

	/**
	 * Number of maximum records in the cache
	 */
	protected max: number = 20;

	/**
	 * @override
	 * @param [max] - number of maximum records in the cache
	 */
	constructor(max?: number) {
		super();

		if (max != null) {
			this.max = max;
		}
	}

	/** @override */
	get(key: K): CanUndef<V> {
		if (this.has(key)) {
			this.queue.delete(key);
			this.queue.add(key);
		}

		return super.get(key);
	}

	/** @override */
	set(key: K, value: V): V {
		this.queue.delete(key);

		if (this.queue.size === this.max) {
			const
				key = this.queue.values().next().value;

			if (key !== undefined) {
				this.remove(key);
			}
		}

		this.queue.add(key);
		return super.set(key, value);
	}

	/** @override */
	remove(key: K): CanUndef<V> {
		if (this.has(key)) {
			this.queue.delete(key);
			return super.remove(key);
		}
	}

	/** @override */
	clear(filter?: ClearFilter<V, K>): Map<K, V> {
		const
			removed = super.clear(filter);

		for (let o = this.queue.values(), i = o.next(); !i.done; i = o.next()) {
			const
				el = i.value;

			if (removed.has(el)) {
				this.queue.delete(el);
			}
		}

		return removed;
	}

	/**
	 * Modify size of cache
	 * @param amount - positive values increase size of cache, negative values decrease size
	 */
	modifySize(amount: number): Map<K, V> {
		const
			removed = new Map<K, V>();

		this.max += amount;
		this.max = this.max > 0 ? this.max : 0;

		if (amount < 0) {
			while (this.max < this.queue.size) {
				const key = this.queue.values().next().value;
				const el = this.remove(key);
				if (el) {
					removed.set(key, el);
				}
			}
		}

		return removed;
	}
}
