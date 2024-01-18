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
export default class RestrictedCache<K = unknown, V = unknown> extends SimpleCache<K, V> {
	/**
	 * Queue object
	 */
	protected readonly queue: Set<K> = new Set();

	/**
	 * Number of maximum records in the cache
	 */
	protected capacity: number = 20;

	/**
	 * @override
	 * @param [max] - number of maximum records in the cache
	 */
	constructor(max?: number) {
		super();

		if (max != null) {
			this.setCapacity(max);
		}
	}

	override get(key: K): CanUndef<V> {
		if (this.has(key)) {
			this.queue.delete(key);
			this.queue.add(key);
		}

		return super.get(key);
	}

	override set(key: K, value: V): V {
		this.queue.delete(key);

		if (this.queue.size === this.capacity) {
			const
				key = this.queue.values().next().value;

			if (key !== undefined) {
				this.remove(key);
			}
		}

		this.queue.add(key);
		return super.set(key, value);
	}

	override remove(key: K): CanUndef<V> {
		if (this.has(key)) {
			this.queue.delete(key);
			return super.remove(key);
		}
	}

	override clear(filter?: ClearFilter<V, K>): Map<K, V> {
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

	override clone(): RestrictedCache<K, V> {
		const
			newCache = new RestrictedCache<K, V>(this.capacity),
			mixin = {queue: new Set(this.queue), storage: new Map(this.storage)};

		Object.assign(newCache, mixin);

		return newCache;
	}

	/**
	 * Sets a new capacity of the cache.
	 * The method returns a map of truncated elements that the cache can't fit anymore.
	 *
	 * @param value
	 */
	setCapacity(value: number): Map<K, V> {
		if (!Number.isInteger(value) || value < 0) {
			throw new TypeError('A value of `max` can be defined only as a non-negative integer number');
		}

		const
			removed = new Map<K, V>(),
			amount = value - this.capacity;

		this.capacity = value;

		if (amount < 0) {
			while (this.capacity < this.queue.size) {
				const
					key = this.queue.values().next().value,
					el = this.remove(key);

				if (el) {
					removed.set(key, el);
				}
			}
		}

		return removed;
	}
}
