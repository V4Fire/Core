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
import type { TTLCache, ClearFilter, DecoratorOptions } from 'core/cache/interface';

export * from 'core/cache/interface';

/**
 * Wrapper for Cache data structures to add the feature of cache expiring.
 *
 * @template V - Values in cache
 * @template K - Keys in cache
 *
 * @param cache
 * @param ttl the default ttl provides in milliseconds
 *
 * @example
 * ```typescript
 * import addTTL from 'core/cache/decorators/ttl';
 * import SimpleCache from 'core/cache/simple';
 *
 * const
 *   cache = addTTL(new SimpleCache(), 10000);
 *
 * cache.add('foo', 'bar1', {ttl: 500});
 * cache.add('foo2', 'bar2');
 * ```
 */
export default function addTTL<V = unknown, K = string>(cache: Cache<V, K>, ttl?: number): TTLCache<V, K> {
	const
		cacheWithTTL: TTLCache<V, K> = Object.create(cache),
		ttlTimers = new Map<K, number | NodeJS.Timeout>();

	cacheWithTTL.set = (key: K, value: V, opts?: DecoratorOptions) => {
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
		}
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
