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
 * @typeparam K - key type of the cache object
 * @typeparam V - value type of the cache object
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
	T extends Cache<K, V>,
	K = unknown,
	V = unknown,
>(cache: Cache<K, V>, ttl?: number): TTLCache<K, V, CacheWithEmitter<K, V, T>> {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {
		remove: originalRemove,
		set: originalSet,
		clear: originalClear,
		clone: originalClone,
		subscribe
	} = addEmitter<TTLCache<K, V>, K, V>(<TTLCache<K, V>><unknown>cache);

	const
		cacheWithTTL: TTLCache<K, V> = Object.create(cache),
		ttlTimers = new Map<K, [number | NodeJS.Timeout, Promise<CanUndef<V>>]>();

	const descriptor = {
			enumerable: false,
			writable: true,
			configurable: true
	};

	Object.defineProperties(cacheWithTTL, {
		ttlTimers: {
			get() {
				return new Map(ttlTimers);
			},
			enumerable: true
		},

		set: {
			value: (key: K, value: V, opts?: TTLDecoratorOptions & Parameters<T['set']>[2]) => {
				updateTTL(key, opts?.ttl);
				return originalSet(key, value, opts);
			},
			...descriptor
		},

		remove: {
			value: (key: K) => {
				cacheWithTTL.removeTTLFrom(key);
				return originalRemove(key);
			},
			...descriptor
		},

		removeTTLFrom: {
			value: (key: K) => {
				if (ttlTimers.has(key)) {
					clearTimeout(<number>ttlTimers.get(key)?.[0]);
					ttlTimers.delete(key);
					return true;
				}

				return false;
			},
			...descriptor
		},

		clear: {
			value: (filter?: ClearFilter<V, K>) => {
				const
					removed = originalClear(filter);

				removed.forEach((_, key) => {
					cacheWithTTL.removeTTLFrom(key);
				});

				return removed;
			},
			...descriptor
		},

		clone: {
			value: () => {
				const
					cache = addTTL(originalClone(), ttl);

				for (const [key, [,promise]] of ttlTimers) {
					void promise.then(() => {
						if (!cache.ttlTimers.has(key)) {
							cache.remove(key);
						}
					});
				}

				return cache;
			},
			...descriptor
		}
	});

	subscribe('remove', cacheWithTTL, ({args}) =>
		cacheWithTTL.removeTTLFrom(args[0]));

	subscribe('set', cacheWithTTL, ({args}) =>
		updateTTL(args[0], args[2]?.ttl));

	subscribe('clear', cacheWithTTL, ({result}) => {
		result.forEach((_, key) => cacheWithTTL.removeTTLFrom(key));
	});

	subscribe('clone', cacheWithTTL, () =>
		cacheWithTTL.clone());

	return cacheWithTTL;

	function updateTTL(key: K, optionTTL?: number): void {
		if (optionTTL != null || ttl != null) {
			const time = optionTTL ?? ttl;

			let timerId;

			const promise = new Promise<CanUndef<V>>((resolve) => {
				timerId = setTimeout(() => resolve(cacheWithTTL.remove(key)), time);
			});

			ttlTimers.set(key, [timerId, promise]);

		} else {
			cacheWithTTL.removeTTLFrom(key);
		}
	}
}
