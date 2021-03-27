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
import type { PersistentOptions, PersistentCache, ClearFilter, DecoratorOptions } from 'core/cache/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import type { CacheWithoutDirectMutations } from 'core/cache/decorators/persistent/interface';

import { isOnline } from 'core/net';
import SyncPromise from 'core/promise/sync';
import { StorageCacheConnector } from 'core/cache/decorators/persistent/helpers';

export * from 'core/cache/interface';

class PersistentWrapper<V = unknown> {
	/**
	 * A cache whose methods will be rewritten to synchronize with the storage
	 */
	private readonly cacheWithStorage: PersistentCache<V, string>;

	/**
	 * Cache
	 */
	private readonly cache: CacheWithoutDirectMutations<V>;

	/**
	 * Storage Cache Connector used for all operations that mutate the cache or storage
	 */
	private readonly StorageCacheConnector: StorageCacheConnector<V>;

	/**
	 * Options that affect how the cache will be initialized and when the wrapper will access the storage
	 */
	private readonly opts: PersistentOptions;

	/**
	 * An object that stores the keys of all properties that have already been fetched from the storage
	 * used only in `lazy` and `semi-lazy` opts
	 */
	private readonly fetchedMemory: Set<string> = new Set();

	constructor(
		cache: Cache<V, string>,
		kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
		opts: PersistentOptions
	) {
		this.cacheWithStorage = Object.create(cache);
		this.cache = cache;
		this.opts = opts;
		this.StorageCacheConnector = new StorageCacheConnector<V>(cache, kvStorage, opts);
	}

	async getInstance(): Promise<PersistentCache<V, string>> {
		await this.StorageCacheConnector.initCache();
		this.watchOnCache();
		this.replaceHasMethod();
		this.replaceGetMethod();
		this.replaceSetMethod();
		this.replaceRemoveMethod();
		this.replaceKeysMethod();
		this.replaceClearMethod();
		return this.cacheWithStorage;
	}

	private watchOnCache(): void {
		// TODO watch on delete props
	}

	private replaceHasMethod(): void {
		this.cacheWithStorage.has = this.getHasMethod('has');
	}

	private replaceGetMethod(): void {
		this.cacheWithStorage.get = this.getHasMethod('get');
	}

	private getHasMethod(method: 'has'): (key: string) => Promise<boolean>
	private getHasMethod(method: 'get'): (key: string) => Promise<CanUndef<V>>
	private getHasMethod(method: 'get' | 'has'): (key: string) => Promise<CanUndef<V> | boolean> {
		return async (key: string) => {
			if (this.opts.initializationStrategy === 'active') {
				return this.cache[method](key);
			}

			if (this.fetchedMemory.has(key)) {
				return this.cache[method](key);
			}

			this.fetchedMemory.add(key);

			const
				online = (await isOnline()).status;

			if (this.opts.readFromMemoryStrategy === 'connectionLoss' && online) {
				return this.cache[method](key);
			}

			await this.StorageCacheConnector.checkPropertyInStorage(key);

			return this.cache[method](key);
		};
	}

	private replaceSetMethod(): void {
		this.cacheWithStorage.set = async (key: string, value: V, opts?: DecoratorOptions) => {
			const
				ttl = this.opts.persistentTTL ?? opts?.ttl;

			this.fetchedMemory.add(key);

			const
				res = await this.StorageCacheConnector.set(key, value, {target: 'both', ttl});

			return res;
		};
	}

	private replaceRemoveMethod(): void {
		this.cacheWithStorage.remove = async (key: string) => {
			this.fetchedMemory.add(key);
			const removed = await this.StorageCacheConnector.remove(key, {target: 'both'});
			return removed;
		};
	}

	private replaceKeysMethod(): void {
		this.cacheWithStorage.keys = async () => {
			const keys = await SyncPromise.resolve(this.cache.keys());
			return keys;
		};
	}

	private replaceClearMethod(): void {
		this.cacheWithStorage.clear = async (filter?: ClearFilter<V, string>) =>
			this.StorageCacheConnector.clear(filter);
	}
}

export default PersistentWrapper;
