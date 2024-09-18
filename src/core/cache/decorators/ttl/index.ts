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

import addEmitter, { CacheWithEmitter } from 'core/cache/decorators/helpers/add-emitter';
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
	K extends string = string,
>(cache: T, ttl?: number): TTLCache<V, K, CacheWithEmitter<V, K, T>> {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {
		remove: originalRemove,
		set: originalSet,
		clear: originalClear,
		subscribe
	} = addEmitter<TTLCache<V, K>, V, K>(<TTLCache<V, K>><unknown>cache);

	const
		ttlStore = new Map<K, number>(),
		dateStore = new Map<K, number>();

	const
		cacheWithTTL: TTLCache<V, K> = Object.create(cache);

	cacheWithTTL.get = (key: K) => {
		const
			dateSet = dateStore.get(key),
			ttl = ttlStore.get(key);

		if (dateSet != null && ttl != null) {
			const
				expired = Date.now() - dateSet > ttl;

			if (expired) {
				cacheWithTTL.remove(key);
				return;
			}
		}

		return cache.get(key);
	};

	cacheWithTTL.has = (key: K) => cacheWithTTL.get(key) !== undefined;

	cacheWithTTL.set = (key: K, value: V, opts?: TTLDecoratorOptions & Parameters<T['set']>[2]) => {
		updateTTL(key, opts?.ttl);
		return originalSet(key, value, opts);
	};

	cacheWithTTL.remove = (key: K) => {
		cacheWithTTL.removeTTLFrom(key);
		return originalRemove(key);
	};

	cacheWithTTL.removeTTLFrom = (key: K) => {
		if (ttlStore.has(key) || dateStore.has(key)) {
			ttlStore.delete(key);
			dateStore.delete(key);

			return true;
		}

		return false;
	};

	cacheWithTTL.clear = (filter?: ClearFilter<V, K>) => {
		const
			removed = originalClear(filter);

		if (filter == null) {
			ttlStore.clear();
			dateStore.clear();

		} else {
			removed.forEach((_, key) => cacheWithTTL.removeTTLFrom(key));
		}

		return removed;
	};

	subscribe('remove', cacheWithTTL, ({args}) =>
		cacheWithTTL.removeTTLFrom(args[0]));

	subscribe('set', cacheWithTTL, ({args}) =>
		updateTTL(args[0], args[2]?.ttl));

	subscribe('clear', cacheWithTTL, ({result}) => {
		result.forEach((_, key) => cacheWithTTL.removeTTLFrom(key));
	});

	return cacheWithTTL;

	function updateTTL(key: K, optionTTL?: number): void {
		const time = optionTTL ?? ttl;

		if (time != null) {
			ttlStore.set(key, time);
			dateStore.set(key, Date.now());

		} else {
			cacheWithTTL.removeTTLFrom(key);
		}
	}
}
