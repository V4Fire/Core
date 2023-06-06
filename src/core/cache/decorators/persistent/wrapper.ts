/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';

import engines from 'core/cache/decorators/persistent/engines';
import addEmitter from 'core/cache/decorators/helpers/add-emitter';

import type { PersistentEngine, CheckablePersistentEngine } from 'core/cache/decorators/persistent/engines/interface';
import type { PersistentOptions, PersistentCache, PersistentTTLDecoratorOptions } from 'core/cache/decorators/persistent/interface';

export default class PersistentWrapper<T extends Cache<V, string>, V = unknown> {
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
	protected readonly wrappedCache: PersistentCache<V>;

	/**
	 * Engine to save cache items within a storage
	 */
	protected readonly engine: PersistentEngine;

	/**
	 * Object that stores keys of all properties that have already been fetched from the storage
	 */
	protected readonly fetchedItems: Set<string> = new Set();

	/**
	 * @param cache - cache object to wrap
	 * @param storage - storage object to save cache items
	 * @param [opts] - additional options
	 */
	constructor(cache: T, storage: SyncStorageNamespace | AsyncStorageNamespace, opts?: PersistentOptions) {
		this.ttl = opts?.persistentTTL;

		this.cache = cache;
		this.wrappedCache = Object.create(cache);

		this.engine = new engines[opts?.loadFromStorage ?? 'onDemand']<V>(storage);
	}

	/**
	 * Returns an instance of the wrapped cache
	 */
	async getInstance(): Promise<PersistentCache<V>> {
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
		const {
			remove: originalRemove,
			set: originalSet,
			clear: originalClear,
			subscribe
		} = addEmitter<T, V, string>(this.cache);

		this.wrappedCache.has = this.getDefaultImplementation('has');
		this.wrappedCache.get = this.getDefaultImplementation('get');

		this.wrappedCache.set = async (key: string, value: V, opts?: PersistentTTLDecoratorOptions & Parameters<T['set']>[2]) => {
			const
				ttl = opts?.persistentTTL ?? this.ttl;

			this.fetchedItems.add(key);

			const
				res = originalSet(key, value, opts);

			if (this.cache.has(key)) {
				await this.engine.set(key, value, ttl);
			}

			return res;
		};

		this.wrappedCache.remove = async (key: string) => {
			this.fetchedItems.add(key);
			await this.engine.remove(key);
			return originalRemove(key);
		};

		this.wrappedCache.keys = () => SyncPromise.resolve(this.cache.keys());

		this.wrappedCache.clear = async (filter?: ClearFilter<V>) => {
			const
				removed = originalClear(filter),
				removedKeys: string[] = [];

			removed.forEach((_, key) => {
				removedKeys.push(key);
			});

			await Promise.allSettled(removedKeys.map((key) => this.engine.remove(key)));
			return removed;
		};

		this.wrappedCache.removePersistentTTLFrom = (key) => this.engine.removeTTLFrom(key);

		subscribe('remove', this.wrappedCache, ({args}) =>
			this.engine.remove(args[0]));

		subscribe('set', this.wrappedCache, ({args}) => {
			const ttl = (<CanUndef<PersistentTTLDecoratorOptions>>args[2])?.persistentTTL ?? this.ttl;
			return this.engine.set(args[0], args[1], ttl);
		});

		subscribe('clear', this.wrappedCache, ({result}) => {
			result.forEach((_, key) => this.engine.remove(key));
		});
	}

	/**
	 * Returns the default implementation for the specified cache method with adding a feature of persistent storing
	 * @param method
	 */
	protected getDefaultImplementation(method: 'has'): (key: string) => Promise<boolean>;
	protected getDefaultImplementation(method: 'get'): (key: string) => Promise<CanUndef<V>>;
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
