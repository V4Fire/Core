/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import type { PersistentOptions, ClearFilter } from 'core/cache/interface';
import type {

	StorageManagerChangeElementParams, StorageManagerMemory,
	ConnectorRemoveCacheOrBothOptions, ConnectorRemoveStorageOptions,
	ConnectorSetCacheOrBothOptions, ConnectorSetStorageOptions

} from 'core/cache/decorators/persistent/interface';

/**
 * The manager for working with the storage
 * collapses changes to the same properties
 * and performs changes only after the previous ones have been made
 */
export class StorageManager {
	/**
	 * Stores keys that will need to be updated at the next iteration
	 */
	protected memory: StorageManagerMemory = {};

	/**
	 * Storage object
	 */
	protected readonly storage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Promise used to ensure that the new iteration starts only after the old one ends
	 */
	protected promise: Promise<unknown> = Promise.resolve();

	constructor(storage: SyncStorageNamespace | AsyncStorageNamespace) {
		this.storage = storage;
	}

	/**
	 * Create a task to set value to storage
	 * Can be combined with the task for the same key, then the callback will be executed only from the last task
	 *
	 * @param key
	 * @param value
	 * @param callback Executed when the value is saved in the storage
	 */
	set(key: string, value: unknown, callback?: () => void): void {
		this.changeElement(key, {
			action: 'set',
			value,
			callback
		});
	}

	/**
	 * Create a task to remove value from storage
	 * Can be combined with the task for the same key, then the callback will be executed only from the last task
	 *
	 * @param key
	 * @param value
	 * @param callback Executed when the value is removed from the storage
	 */
	remove(key: string, callback?: () => void): void {
		this.changeElement(key, {
			action: 'remove',
			callback
		});
	}

	/**
	 * The adapter is needed to have a standard set/remove API
	 * As soon as the first change occurs the state creates a task for updating the storage
	 *
	 * @param key
	 * @param parameters
	 */
	protected changeElement(key: string, parameters: StorageManagerChangeElementParams): void {
		this.memory[key] = parameters;

		if (Object.keys(this.memory).length === 1) {
			this.promise = this.promise.then(async () => {
				await this.makeIteration();
			});
		}
	}

	/**
	 * Executes all the tasks saved in the current iteration
	 * and creates a promise that will be resolved when all the tasks are completed
	 */
	protected async makeIteration(): Promise<void> {
		const
			clone = {...this.memory};
		this.memory = {};

		await Promise.all(Object.keys(clone).map((key) => {
			const promiseForKey = new Promise<void>(async (resolve) => {
				if (clone[key].action === 'remove') {
					await this.storage.remove(key);
				} else {
					await this.storage.set(key, clone[key].value);
				}

				const
					cb = clone[key].callback;

				if (cb) {
					cb();
				}

				resolve();
			});
			return promiseForKey;
		}));
	}
}

const ttlPostfix = '__ttl';
const inMemoryPath = '__storage__';

/**
 * The connector knows which fields to write ttl in which mode and how to get them
 * Used for encapsulating the storage and cache relationships
 */
export class StorageCacheConnector<V = unknown> {
	/**
	 * Cache
	 */
	protected readonly cache: Cache<V, string>;

	/**
	 * Storage object
	 */
	protected readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Options that affect how the cache will be initialized and when the wrapper will access the storage
	 */
	protected readonly opts: PersistentOptions;

	/**
	 * Used for saving and deleting properties from storage
	 */
	protected readonly StorageManager: StorageManager;

	/**
	 * An object that stores the keys of all properties in the storage and their ttls
	 * used only in `active` and `semi-lazy` opts
	 */
	protected storage: {[key: string]: number} = {};

	constructor(
		cache: Cache<V, string>,
		kvStorage: SyncStorageNamespace | AsyncStorageNamespace,
		opts: PersistentOptions
	) {
		this.cache = cache;
		this.kvStorage = kvStorage;
		this.opts = opts;
		this.StorageManager = new StorageManager(kvStorage);
	}

	public async initCache(): Promise<void> {
		if (await this.kvStorage.has(inMemoryPath)) {
			this.storage = (await this.kvStorage.get<{[key: string]: number}>(inMemoryPath))!;
		} else {
			await this.kvStorage.set(inMemoryPath, this.storage);
		}

		if (this.opts.loadFromStorage === 'onInit') {
			const
				time = Date.now();

			await Promise.all(Object.keys(this.storage).map((key) => {
				const promiseInitProp = new Promise<void>(async (resolve) => {
					if (this.storage[key] > time) {
						const value = (await this.kvStorage.get<V>(key))!;
						await this.set(key, value, {target: 'cache'});
					} else {
						void this.remove(key, {target: 'storage'});
					}

					resolve();
				});

				return promiseInitProp;
			}));
		}
	}

	public async set(key: string, value: V, opts: ConnectorSetCacheOrBothOptions): Promise<V>
	public async set(key: string, value: V, opts: ConnectorSetStorageOptions): Promise<undefined>
	public async set(
		key: string,
		value: V,
		opts: ConnectorSetCacheOrBothOptions | ConnectorSetStorageOptions
	): Promise<undefined | V> {
		if (opts.target === 'both' || opts.target === 'storage') {

			if (this.opts.loadFromStorage === 'onInit') {
				await this.StorageManager.set(key, value, () => {
					this.storage[key] = opts.ttl ?? Number.MAX_SAFE_INTEGER;
					const copyOfStorage = {...this.storage};
					this.StorageManager.set(inMemoryPath, copyOfStorage);
				});

			} else {
				await this.StorageManager.set(key, value, () => {
					this.StorageManager.set(`${key}${ttlPostfix}`, opts.ttl ?? Number.MAX_SAFE_INTEGER);
				});
			}
		}

		if (opts.target === 'both' || opts.target === 'cache') {
			return this.cache.set(key, value);
		}
	}

	public async remove(key: string, opts: ConnectorRemoveCacheOrBothOptions): Promise<V>
	public async remove(key: string, opts: ConnectorRemoveStorageOptions): Promise<undefined>
	public async remove(
		key: string,
		opts: ConnectorRemoveCacheOrBothOptions | ConnectorRemoveStorageOptions
	): Promise<undefined | V> {
		if (opts.target === 'both' || opts.target === 'storage') {

			if (this.opts.loadFromStorage === 'onInit') {
				await this.StorageManager.remove(key, () => {
					delete this.storage[key];
					const copyOfStorage = {...this.storage};
					this.StorageManager.set(inMemoryPath, copyOfStorage);
				});

			} else {
				await this.StorageManager.remove(key, () => {
					this.StorageManager.remove(`${key}${ttlPostfix}`);
				});
			}
		}

		if (opts.target === 'both' || opts.target === 'cache') {
			return this.cache.remove(key);
		}
	}

	public async clear(filter?: ClearFilter<V, string>): Promise<Map<string, V>> {
		const
			removed = this.cache.clear(filter),
			removedKeys: string[] = [];

		removed.forEach((_, key) => {
			removedKeys.push(key);
		});

		await Promise.all(removedKeys.map((key) => this.remove(key, {target: 'storage'})));

		return removed;
	}

	public async checkPropertyInStorage(key: string): Promise<void> {
		const
			ttl = await this.getTTL(key),
			time = Date.now();

		if (ttl != null && ttl > time) {
			if (ttl > time) {
				const value = await this.kvStorage.get<V>(key);
				if (value != null) {
					await this.set(key, value, {target: 'cache'});
				}
			} else {
				await this.remove(key, {target: 'storage'});
			}
		}
	}

	public async getTTL(key: string): Promise<number | null> {
		if (this.opts.loadFromStorage === 'onInit') {
			return <number | undefined>this.storage[key] ?? null;
		}

		const ttl = await this.kvStorage.get<number>(`${key}${ttlPostfix}`);
		return ttl ?? null;
	}
}
