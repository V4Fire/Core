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

	cacheWithTTL.removeTTLFrom = function removeTTLFrom(key: K) {
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
