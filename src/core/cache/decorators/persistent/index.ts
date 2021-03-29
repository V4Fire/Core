/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/decorators/persistent/README.md]]
 * @packageDocumentation
 */

import type Cache from 'core/cache/interface';
import type { PersistentOptions, PersistentCache, ClearFilter, DecoratorOptions } from 'core/cache/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import type { AvailableToCheckInStorageEngine, PersistentEngine } from 'core/cache/decorators/persistent/engines/interface';

import SyncPromise from 'core/promise/sync';
import engines from 'core/cache/decorators/persistent/engines';

export * from 'core/cache/decorators/persistent/interface';

class PersistentWrapper<V = unknown> {
	/**
	 * A cache whose methods will be rewritten to synchronize with the storage
	 */
	protected readonly cacheWithStorage: PersistentCache<V, string>;

	/**
	 * Cache
	 */
	protected readonly cache: Cache<V>;

	/**
	 * An object that stores the keys of all properties that have already been fetched from the storage
	 */
	protected readonly fetchedMemory: Set<string> = new Set();

	/**
	 * Engine with strategy
	 */
	protected readonly engine: PersistentEngine;

	/**
	 * Default ttl for storage
	 */
	protected readonly ttl?: number;

	constructor(
		cache: Cache<V, string>,
		kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
		opts: PersistentOptions
	) {
		this.cacheWithStorage = Object.create(cache);
		this.cache = cache;
		this.engine = new engines[opts.loadFromStorage]<V>(kvStorage);
	}

	async getInstance(): Promise<PersistentCache<V, string>> {
		if (this.engine.initCache) {
			await this.engine.initCache(this.cache);
		}

		this.replaceHasMethod();
		this.replaceGetMethod();
		this.replaceSetMethod();
		this.replaceRemoveMethod();
		this.replaceKeysMethod();
		this.replaceClearMethod();
		return this.cacheWithStorage;
	}

	protected replaceHasMethod(): void {
		this.cacheWithStorage.has = this.getHasMethod('has');
	}

	protected replaceGetMethod(): void {
		this.cacheWithStorage.get = this.getHasMethod('get');
	}

	protected getHasMethod(method: 'has'): (key: string) => Promise<boolean>
	protected getHasMethod(method: 'get'): (key: string) => Promise<CanUndef<V>>
	protected getHasMethod(method: 'get' | 'has'): (key: string) => Promise<CanUndef<V> | boolean> {
		return async (key: string) => {
			if (this.fetchedMemory.has(key)) {
				return this.cache[method](key);
			}

			this.fetchedMemory.add(key);

			if (await this.engine.isNeedToCheckInStorage(method, key)) {
				await this.checkPropertyInStorage(key);
			}

			return this.cache[method](key);
		};
	}

	protected replaceSetMethod(): void {
		this.cacheWithStorage.set = async (key: string, value: V, opts?: DecoratorOptions) => {
			const
				ttl = this.ttl ?? opts?.ttl;

			this.fetchedMemory.add(key);

			await this.engine.set(key, value, ttl);
			const
				res = this.cache.set(key, value, opts);

			return res;
		};
	}

	protected replaceRemoveMethod(): void {
		this.cacheWithStorage.remove = async (key: string) => {
			this.fetchedMemory.add(key);

			await this.engine.remove(key);
			const
				removed = this.cache.remove(key);

			return removed;
		};
	}

	protected replaceKeysMethod(): void {
		this.cacheWithStorage.keys = async () => {
			const keys = await SyncPromise.resolve(this.cache.keys());
			return keys;
		};
	}

	protected async checkPropertyInStorage(key: string): Promise<void> {
		const
			ttl = await this.engine.getTTL(key),
			time = Date.now();

		if (ttl != null && ttl < time) {
			await this.engine.remove(key);

		} else {
			const value = await (<AvailableToCheckInStorageEngine>this.engine).get<V>(key);
			if (value != null) {
				await this.cache.set(key, value);
			}
		}
	}

	protected replaceClearMethod(): void {
		this.cacheWithStorage.clear = async (filter?: ClearFilter<V, string>) => {
			const
				removed = this.cache.clear(filter),
				removedKeys: string[] = [];

			removed.forEach((_, key) => {
				removedKeys.push(key);
			});

			await Promise.all(removedKeys.map((key) => this.engine.remove(key)));

			return removed;
		};
	}
}

const addPersistent = async <V>(
	cache: Cache<V, string>,
	kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
	opts: PersistentOptions
): Promise<PersistentCache<V, string>> => {
	const persistentCache = await new PersistentWrapper(cache, kvStorage, opts).getInstance();
	return persistentCache;
};

export default addPersistent;
