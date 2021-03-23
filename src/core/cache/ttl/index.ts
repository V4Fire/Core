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

export default function wrapCacheWithTTL<V = unknown, K = string>(cache: Cache<V, K>, ttl?: number): TTLCache<V, K> {
	const
		cacheWithTTL: TTLCache<V, K> = Object.create(cache),
		ttlMemory = new Map<K, number>();

	cacheWithTTL.set = (key: K, value: V, options?: DecoratorOptions) => {
		if (options?.ttl != null || ttl != null) {
			const
				time = options?.ttl ?? ttl;

			cacheWithTTL.clearTTL(key);
			ttlMemory.set(key, (<Window['setTimeout']>setTimeout)(() => cacheWithTTL.remove(key), time));
		}

		return cache.set(key, value, options);
	};

	cacheWithTTL.remove = (key: K) => {
		cacheWithTTL.clearTTL(key);
		return cache.remove(key);
	};

	cacheWithTTL.clearTTL = function clearTTL(key: K) {
		if (ttlMemory.has(key)) {
			clearTimeout(ttlMemory.get(key));
			ttlMemory.delete(key);
		}
	};

	cacheWithTTL.clear = (filter?: ClearFilter<V, K>) => {
		const
			removed = cache.clear(filter);

		removed.forEach((_, key) => {
			cacheWithTTL.clearTTL(key);
		});

		return removed;
	};

	return cacheWithTTL;
}
