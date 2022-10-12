/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import { unimplement } from 'core/functools';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';

import engines from 'core/cache/decorators/persistent/engines';
import addEmitter from 'core/cache/decorators/helpers/add-emitter';

import type { PersistentEngine, CheckablePersistentEngine } from 'core/cache/decorators/persistent/engines/interface';
import type {

	PersistentOptions,
	PersistentCache,
	PersistentTTLDecoratorOptions

} from 'core/cache/decorators/persistent/interface';

export default class PersistentWrapper<T extends Cache<string, V>, V = unknown> {
	/**
	 * Default TTL to store items
	 */
	protected readonly ttl?: number;

	/**
	 * Original cache object
	 */
	protected readonly cache: T;

	/**
	 * Wrapped cache object
	 */
	protected readonly wrappedCache: PersistentCache<string, V>;

	/**
	 * Engine to save cache items within a storage
	 */
	protected readonly engine: PersistentEngine;

	/**
	 * Object that stores keys of all properties that have already been fetched from the storage
	 */
	protected readonly fetchedItems: Set<string> = new Set();

	/**
	 * Object with incom
	 */
	protected readonly opts?: PersistentOptions;

	/**
	 * @param cache - cache object to wrap
	 * @param storage - storage object to save cache items
	 * @param [opts] - additional options
	 */
	constructor(cache: T, storage: SyncStorageNamespace | AsyncStorageNamespace, opts?: PersistentOptions) {
		this.ttl = opts?.persistentTTL;

		this.cache = cache;
		this.wrappedCache = Object.create(cache);
		this.opts = opts;

		this.engine = new engines[opts?.loadFromStorage ?? 'onDemand']<V>(storage);
	}

	/**
	 * Returns an instance of the wrapped cache
	 */
	async getInstance(): Promise<PersistentCache<string, V>> {
		if (this.engine.initCache) {
			await this.engine.initCache(this.cache);
		}

		this.implementAPI();
		return this.wrappedCache;
	}

	/**
	 * Implements API of the wrapped cache object
	 */
	protected implementAPI(): void {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const {
			remove: originalRemove,
			set: originalSet,
			clear: originalClear,
			subscribe
		} = addEmitter<T, string, V>(this.cache);

		const descriptor = {
			enumerable: false,
			writable: true,
			configurable: true
		};

		Object.defineProperties(this.wrappedCache, {
			has: {
				value: this.getDefaultImplementation('has'),
				...descriptor
			},

			get: {
				value: this.getDefaultImplementation('get'),
				...descriptor
			},

			set: {
				value: async (key: string, value: V, opts?: PersistentTTLDecoratorOptions & Parameters<T['set']>[2]) => {
					const
						ttl = opts?.persistentTTL ?? this.ttl;

					this.fetchedItems.add(key);

					const
						res = originalSet(key, value, opts);

					if (this.cache.has(key)) {
						await this.engine.set(key, value, ttl);
					}

					return res;
				},
				...descriptor
			},

			remove: {
				value: async (key: string) => {
					this.fetchedItems.add(key);
					await this.engine.remove(key);
					return originalRemove(key);
				},
				...descriptor
			},

			keys: {
				value: () => SyncPromise.resolve(this.cache.keys()),
				...descriptor
			},

			clear: {
				value: async (filter?: ClearFilter<V>) => {
					const
						removed = originalClear(filter),
						removedKeys: string[] = [];

					removed.forEach((_, key) => {
						removedKeys.push(key);
					});

					await Promise.allSettled(removedKeys.map((key) => this.engine.remove(key)));
					return removed;
				},
				...descriptor
			},

			clone: {
				value: () => {
					unimplement({
						type: 'function',
						alternative: {name: 'cloneTo'}
					}, this.wrappedCache.clone);
				},
				...descriptor
			},

			cloneTo: {
				value: async (
					storage: SyncStorageNamespace | AsyncStorageNamespace
				): Promise<PersistentCache<string, V>> => {
					const
						cache = new PersistentWrapper<Cache<string, V>, V>(this.cache.clone(), storage, {...this.opts});

					Object.defineProperty(cache, 'fetchedItems', {
						value: new Set(this.fetchedItems),
						enumerable: true,
						configurable: true,
						writable: true
					});

					for (const [key, value] of this.cache.entries()) {
						const
							ttl = this.engine.ttlIndex[key] ?? 0,
							time = Date.now();

						if (ttl > time) {
							await cache.engine.set(key, value, ttl - time);

						} else {
							cache.cache.remove(key);
						}
					}

					return cache.getInstance();
				},
				...descriptor
			},

			removePersistentTTLFrom: {
				value: (key) => this.engine.removeTTLFrom(key),
				...descriptor
			}
		});

		subscribe('remove', this.wrappedCache, ({args}) =>
			this.engine.remove(args[0]));

		subscribe('set', this.wrappedCache, ({args}) => {
			const ttl = (<CanUndef<PersistentTTLDecoratorOptions>>args[2])?.persistentTTL ?? this.ttl;
			return this.engine.set(args[0], args[1], ttl);
		});

		subscribe('clear', this.wrappedCache, ({result}) => {
			result.forEach((_, key) => this.engine.remove(key));
		});

		subscribe('clone', this.wrappedCache, () =>
			this.wrappedCache.clone());
	}

	/**
	 * Returns the default implementation for the specified cache method with adding a feature of persistent storing
	 * @param method
	 */
	protected getDefaultImplementation(method: 'has'): (key: string) => Promise<boolean>
	protected getDefaultImplementation(method: 'get'): (key: string) => Promise<CanUndef<V>>
	protected getDefaultImplementation(method: 'get' | 'has'): (key: string) => Promise<CanUndef<V> | boolean> {
		return (key) => {
			if (this.fetchedItems.has(key)) {
				return SyncPromise.resolve(this.cache[method](key));
			}

			return SyncPromise.resolve(this.engine.getCheckStorageState(method, key)).then((state) => {
				if (state.checked) {
					this.fetchedItems.add(key);
				}

				if (state.available) {
					return this.checkItemInStorage(key).then(() => this.cache[method](key));
				}

				return this.cache[method](key);
			});
		};
	}

	/**
	 * Checks a cache item by the specified key in the persistent storage
	 * @param key
	 */
	protected checkItemInStorage(key: string): Promise<void> {
		return this.engine.getTTLFrom(key).then((ttl) => {
			const
				time = Date.now();

			if (ttl != null && ttl < time) {
				return this.engine.remove(key);
			}

			const
				val = (<CheckablePersistentEngine>this.engine).get<V>(key);

			return SyncPromise.resolve(val).then((val) => {
				if (val != null) {
					return this.cache.set(key, val);
				}
			});
		});
	}
}
