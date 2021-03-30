/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/ttl/README.md]]
 * @packageDocumentation
 */

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';
import type { TTLDecoratorOptions, TTLCache } from 'core/cache/decorators/ttl/interface';

export * from 'core/cache/decorators/ttl/interface';

/**
 * Wraps the specified cache object to add a feature of the cache expiring
 *
 * @typeparam V - value type of the cache object
 * @typeparam K - key type of the cache object
 *
 * @param cache - cache object to wrap
 * @param ttl - default ttl value in milliseconds
 *
 * @example
 * ```typescript
 * import addTTL from 'core/cache/decorators/ttl';
 * import SimpleCache from 'core/cache/simple';
 *
 * const
 *   cache = addTTL(new SimpleCache(), (10).seconds());
 *
 * cache.add('foo', 'bar1', {ttl: 0.5.seconds()});
 * cache.add('foo2', 'bar2');
 * ```
 */
export default function addTTL<
	T extends Cache<V, K>,
	V = unknown,
	K = string,
>(cache: T, ttl?: number): TTLCache<V, K, T> {
	const
		cacheWithTTL: TTLCache<V, K> = Object.create(cache),
		ttlTimers = new Map<K, number | NodeJS.Timeout>();

	cacheWithTTL.set = (key: K, value: V, opts?: TTLDecoratorOptions & Parameters<T['set']>[2]) => {
		if (opts?.ttl != null || ttl != null) {
			const
				time = opts?.ttl ?? ttl;

			cacheWithTTL.removeTTLFrom(key);
			ttlTimers.set(key, setTimeout(() => cacheWithTTL.remove(key), time));
		}

		return cache.set(key, value, opts);
	};

	cacheWithTTL.remove = (key: K) => {
		cacheWithTTL.removeTTLFrom(key);
		return cache.remove(key);
	};

	cacheWithTTL.removeTTLFrom = (key: K) => {
		if (ttlTimers.has(key)) {
			clearTimeout(<number>ttlTimers.get(key));
			ttlTimers.delete(key);
			return true;
		}

		return false;
	};

	cacheWithTTL.clear = (filter?: ClearFilter<V, K>) => {
		const
			removed = cache.clear(filter);

		removed.forEach((_, key) => {
			cacheWithTTL.removeTTLFrom(key);
		});

		return removed;
	};

	return cacheWithTTL;
}
