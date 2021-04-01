/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';
import type { ClearFilter } from 'core/cache/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import type { AvailableToCheckInStorageEngine, PersistentEngine } from 'core/cache/decorators/persistent/engines/interface';
import type { PersistentOptions, PersistentCache, PersistentTTLDecoratorOptions } from 'core/cache/decorators/persistent/interface';

import SyncPromise from 'core/promise/sync';
import engines from 'core/cache/decorators/persistent/engines';

export class PersistentWrapper<T extends Cache<V, string>, V = unknown> {
	/**
	 * A cache whose methods will be rewritten to synchronize with the storage
	 */
	protected readonly cacheWithStorage: PersistentCache<V, string>;

	/**
	 * Cache
	 */
	protected readonly cache: T;

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
		cache: T,
		kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
		opts?: PersistentOptions
	) {
		this.cacheWithStorage = Object.create(cache);
		this.cache = cache;
		this.engine = new engines[opts?.loadFromStorage ?? 'onDemand']<V>(kvStorage);
		this.ttl = opts?.persistentTTL;
	}

	async getInstance(): Promise<PersistentCache<V, string>> {
		if (this.engine.initCache) {
			await this.engine.initCache(this.cache);
		}

		this.overrideAPI();

		return this.cacheWithStorage;
	}

	protected overrideAPI(): void {
		this.cacheWithStorage.has = this.getHasMethod('has');

		this.cacheWithStorage.get = this.getHasMethod('get');

		this.cacheWithStorage.set = async (key: string, value: V, opts?: PersistentTTLDecoratorOptions & Parameters<T['set']>[2]) => {
			const
				ttl = opts?.persistentTTL ?? this.ttl;

			this.fetchedMemory.add(key);

			await this.engine.set(key, value, ttl);
			const
				res = this.cache.set(key, value, opts);

			return res;
		};

		this.cacheWithStorage.remove = async (key: string) => {
			this.fetchedMemory.add(key);

			await this.engine.remove(key);
			const
				removed = this.cache.remove(key);

			return removed;
		};

		this.cacheWithStorage.keys = async () => {
			const keys = await SyncPromise.resolve(this.cache.keys());
			return keys;
		};

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

		this.cacheWithStorage.removePersistentTTL = async (key: string) => {
			await this.engine.removeTTL(key);
		};
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
}
