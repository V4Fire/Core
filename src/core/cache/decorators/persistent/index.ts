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

import type Cache, {DecoratorOptions} from 'core/cache/interface';
import type { PersistentOptions, PersistentCache, ClearFilter } from 'core/cache/interface';

import { isOnline } from 'core/net';
import watch from 'core/object/watch';
import SyncPromise from 'core/promise/sync';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import { StorageManager } from 'core/cache/decorators/persistent/helpers';

export * from 'core/cache/interface';

const ttlPostfix = '__ttl';
const inMemoryPath = '__storage__';

class PersistentWrapper<V = unknown> {
	/**
	 * A cache whose methods will be rewritten to synchronize with the storage
	 */
	private readonly cacheWithStorage: PersistentCache<V, string>;

	/**
	 * Cache
	 */
	private readonly cache: Cache<V, string>;

	/**
	 * Storage object
	 */
	private readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Options that affect how the cache will be initialized and when the wrapper will access the storage
	 */
	private readonly options: PersistentOptions;

	/**
	 * Used for saving and deleting properties from storage
	 */
	private readonly StorageManager: StorageManager;

	/**
	 * An object that stores the keys of all properties that have already been fetched from the storage
	 * used only in `lazy` and `semi-lazy` options
	 */
	private readonly fetchedMemory: Set<string> = new Set();

	/**
	 * An object that stores the keys of all properties in the storage and their ttls
	 * used only in `active` and `semi-lazy` options
	 */
	private storage: {[key: string]: number} = {};

	constructor(
		cache: Cache<V, string>,
		kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
		options: PersistentOptions
	) {
		this.cacheWithStorage = Object.create(cache);
		this.cache = cache;
		this.kvStorage = kvStorage;
		this.options = options;
		this.StorageManager = new StorageManager(kvStorage);
	}

	async getInstance(): Promise<PersistentCache<V, string>> {
		await this.init();
		this.watchOnCache();
		this.replaceHasMethod();
		this.replaceGetMethod();
		this.replaceSetMethod();
		this.replaceRemoveMethod();
		this.replaceKeysMethod();
		this.replaceClearMethod();
		return this.cacheWithStorage;
	}

	private async init(): Promise<void> {
		if (await this.kvStorage.has(inMemoryPath)) {
			this.storage = (await this.kvStorage.get<{[key: string]: number}>(inMemoryPath))!;
		} else {
			await this.kvStorage.set(inMemoryPath, this.storage);
		}

		if (this.options.initializationStrategy === 'active') {
			const
				time = Date.now();

			await Promise.all(Object.keys(this.storage).map((key) => {
				const promiseInitProp = new Promise<void>(async (resolve) => {
					if (this.storage[key] > time) {
						const value = (await this.kvStorage.get<V>(key))!;
						await this.cacheWithStorage.set(key, value);
					} else {
						void this.removeValueFromStorage(key);
					}

					resolve();
				});

				return promiseInitProp;
			}));
		}
	}

	private watchOnCache(): void {
		this.cache.storage = watch(this.cache.storage, {deep: true, immediate: true}, (newValue, oldValue, params) => {
			this.StorageManager.set(params.originalPath, newValue);
		});
	}

	private replaceHasMethod(): void {
		this.cacheWithStorage.has = async (key: string) => {
			if (this.options.initializationStrategy === 'active') {
				return this.cache.has(key);
			}

			if (this.fetchedMemory.has(key)) {
				return this.cache.has(key);
			}

			this.fetchedMemory.add(key);

			const
				online = (await isOnline()).status,
				time = Date.now();

			if (this.options.readFromMemoryStrategy === 'connectionLoss' && online) {
				return this.cache.has(key);
			}

			if (this.options.initializationStrategy === 'lazy') {
				const value = await this.kvStorage.has(key) && await this.kvStorage.get<V>(key);

				if (value != null && value !== false) {
					const timeStampTTL = await this.kvStorage.has(`${key}${ttlPostfix}`) && await this.kvStorage.get<number>(`${key}${ttlPostfix}`);

					if (timeStampTTL != null && timeStampTTL > time) {
						this.cache.set(key, value);
						return true;
					}
				}

				return this.cache.has(key);
			}

			const ttl = this.storage[key];

			if (ttl > time) {
				const value = await this.kvStorage.has(key) && await this.kvStorage.get<V>(key);

				if (value != null && value !== false) {
					this.cache.set(key, value);
					return true;
				}
			}

			return this.cache.has(key);
		};
	}

	private replaceGetMethod(): void {
		this.cacheWithStorage.get = async (key: string) => {
			if (this.options.initializationStrategy === 'active') {
				return this.cache.get(key);
			}

			if (this.fetchedMemory.has(key)) {
				return this.cache.get(key);
			}

			this.fetchedMemory.add(key);

			const
				online = (await isOnline()).status,
				time = Date.now();

			if (this.options.readFromMemoryStrategy === 'connectionLoss' && online) {
				return this.cache.get(key);
			}

			if (this.options.initializationStrategy === 'lazy') {
				const value = await this.kvStorage.get<V>(key);

				if (value != null) {
					const timeStampTTL = await this.kvStorage.get<number>(`${key}${ttlPostfix}`);

					if (timeStampTTL != null && timeStampTTL > time) {
						this.cache.set(key, value);
						return value;
					}
				}

				return this.cache.get(key);
			}

			const ttl = this.storage[key];

			if (ttl > time) {
				const value = await this.kvStorage.get<V>(key);

				if (value != null) {
					this.cache.set(key, value);
					return value;
				}
			}

			return this.cache.get(key);
		};
	}

	private replaceSetMethod(): void {
		this.cacheWithStorage.set = async (key: string, value: V, opts?: DecoratorOptions) => {
			// TODO
		};
	}

	private replaceRemoveMethod(): void {
		this.cacheWithStorage.remove = async (key: string) => {
			this.fetchedMemory.add(key);
			const removed = await this.removeValue(key);
			return removed;
		};
	}

	private async removeValue(key: string): Promise<CanUndef<V>> {
		await this.removeValueFromStorage(key);
		return this.cache.remove(key);
	}

	private async removeValueFromStorage(key: string): Promise<void> {
		await Promise.all([
			this.StorageManager.remove(`${key}__ttl`),
			this.StorageManager.remove(key, () => {
				delete this.storage[key];
				const copyOfStorage = {...this.storage};
				this.StorageManager.set(inMemoryPath, copyOfStorage);
			})
		]);
	}

	private replaceKeysMethod(): void {
		this.cacheWithStorage.keys = async () => {
			const keys = await SyncPromise.resolve(this.cache.keys());
			return keys;
		};
	}

	private replaceClearMethod(): void {
		this.cacheWithStorage.clear = async (filter?: ClearFilter<V, string>) => {
			const
				removed = this.cache.clear(filter),
				removedKeys: string[] = [];

			removed.forEach((_, key) => {
				removedKeys.push(key);
			});

			await Promise.all(removedKeys.map((key) => this.removeValueFromStorage(key)));

			return removed;
		};
	}
}

export default PersistentWrapper;
