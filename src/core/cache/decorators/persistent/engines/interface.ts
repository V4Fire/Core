/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import type Cache from 'core/cache/interface';

export interface AbstractPersistentEngine<V = unknown> {
	/**
	 * Initializes a new cache instance from the past one
	 * @param cache
	 */
	initCache?(cache: Cache<unknown, V>): CanPromise<void>;
}

export abstract class AbstractPersistentEngine<V = unknown> {
	/**
	 * Index with keys and TTL-s of stored values
	 */
	ttlIndex: Dictionary<number> = Object.createDict();

	/**
	 * API for async operations
	 */
	protected async: Async = new Async();

	/**
	 * API to store data
	 */
	protected readonly storage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Map of pending operations by keys
	 */
	protected readonly pending: Map<string, Promise<unknown>> = new Map();

	constructor(storage: SyncStorageNamespace | AsyncStorageNamespace) {
		this.storage = storage;
	}

	/**
	 * Sets a value to the storage by the specified key and ttl
	 *
	 * @param key
	 * @param value
	 * @param [ttl]
	 */
	abstract set(key: string, value: V, ttl?: number): Promise<void>;

	/**
	 * Removes a value from the storage by the specified key
	 * @param key
	 */
	abstract remove(key: string): Promise<void>;

	/**
	 * Returns a value of the `persistentTTL` descriptor by the specified key
	 * @param key
	 */
	abstract getTTLFrom(key: string): Promise<CanUndef<number>>;

	/**
	 * Removes the `persistentTTL` descriptor from a cache item by the specified key.
	 * The method returns `true` if the operation has been successful, otherwise `false`
	 * (the requested item hasn't been found).
	 *
	 * @param key
	 */
	abstract removeTTLFrom(key: string): Promise<boolean>;

	/**
	 * Normalized the given TTL value and returns it
	 * @param ttl
	 */
	protected normalizeTTL(ttl: Nullable<number>): number {
		let
			normalizedTTL = ttl != null ? Date.now() + ttl : Number.MAX_SAFE_INTEGER;

		if (!Number.isSafeInteger(ttl)) {
			normalizedTTL = Number.MAX_SAFE_INTEGER;
		}

		return normalizedTTL;
	}

	/**
	 * Registers a task to update a cache item by the specified key
	 *
	 * @param key
	 * @param task - function that doing something with the storage
	 */
	protected async execTask<T>(key: string, task: () => CanPromise<T>): Promise<T> {
		if (this.pending.has(key)) {
			try {
				await this.pending.get(key);

			} catch (err) {
				stderr(err);
			}
		}

		let
			promise;

		try {
			await this.async.nextTick({label: key});

			promise = (async () => {
				try {
					return await task();

				} finally {
					this.pending.delete(key);
				}
			})();

			this.pending.set(key, promise);

		} catch (err) {
			stderr(err);
		}

		return promise;
	}
}

export abstract class CheckablePersistentEngine<V = unknown> extends AbstractPersistentEngine<V> {
	/**
	 * Returns a value from the storage by the specified key.
	 * Before checking the storage, the method will ask `getCheckStorageState` for permissions to do it.
	 *
	 * @param key
	 */
	abstract get<T = unknown>(key: string): CanPromise<CanUndef<T>>;

	/**
	 * This method is called before every operation that checks data from the storage, like, `has` or `get`
	 *
	 * @param method - operation method
	 * @param key - data key within the storage
	 */
	abstract getCheckStorageState(method: 'get' | 'has', key: string): CanPromise<StorageCheckState>;
}

/**
 * A subtype of a persistent engine where `getCheckStorageState` will always return `available: false`.
 * It allows you not to implement the `get` method.
 */
export abstract class UncheckablePersistentEngine<V = unknown> extends AbstractPersistentEngine<V> {
	abstract getCheckStorageState(method: 'get' | 'has', key: string): CanPromise<{
		available: false;
		checked: boolean;
	}>;
}

/**
 * Engine to provide the persistent feature
 */
export type PersistentEngine<V = unknown> = CheckablePersistentEngine<V> | UncheckablePersistentEngine<V>;

/**
 * Available checking state of a storage item:
 *
 * 1. `available: false; checked: false` - don't need to check the storage, don't mark the item as checked;
 * 2. `available: false; checked: true` - don't need to check the storage, mark the item as checked;
 * 3. `available: true; checked: true` - check the storage, mark the item is checked.
 */
export type StorageCheckState =
	{available: false; checked: boolean} |
	{available: true; checked: true};
