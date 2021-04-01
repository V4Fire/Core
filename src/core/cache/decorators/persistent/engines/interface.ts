/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

import Async from 'core/async';

interface AbstractPersistentEngine<V = unknown> {
	/**
	 * Init cache before return instance of the cache
	 * @param cache
	 */
	initCache?(cache: Cache<V>): CanPromise<void>;
}

abstract class AbstractPersistentEngine<V = unknown> {
	/**
	 * Storage object
	 */
	protected abstract readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Async instance
	 */
	protected async: Async = new Async();

	/**
	 * Pending requests of change property
	 */
	protected readonly pending: Map<string, Promise<unknown>> = new Map();

	/**
	 * Checking TTL of some property
	 * @param key
	 */
	abstract getTTL(key: string): CanPromise<number | undefined>;

	/**
	 * Set value to the storage
	 * @param key
	 * @param value
	 * @param ttl
	 */
	abstract set(key: string, value: V, ttl?: number): void;

	/**
	 * Remove value from storage
	 * @param key
	 */
	abstract remove(key: string): void;

	/**
	 * Creating a task to update a property
	 *
	 * @param key key of property to update
	 * @param task Storage and TTL update task
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

export abstract class AvailableToCheckInStorageEngine<V = unknown> extends AbstractPersistentEngine<V> {
	/**
	 * Get value from storage used only in action `check in storage`
	 * @param key
	 */
	abstract get<T = unknown>(key: string): CanPromise<T | undefined>;

	/**
	 * Before every method 'get' | 'has' called this method is invoked
	 * If method return true will call action `check in storage`
	 *
	 * @param method
	 * @param key
	 */
	abstract isNeedToCheckInStorage(method: 'get' | 'has', key: string): CanPromise<boolean>;
}

/**
 * Subtype of engine where `isNeedToCheckInStorage` always return false
 * allows you not to implement method 'get'
 */
export abstract class UnavailableToCheckInStorageEngine<V = unknown> extends AbstractPersistentEngine<V> {
	abstract isNeedToCheckInStorage(method: 'get' | 'has', key: string): CanPromise<false>;
}

/**
 * Engine to connect logic with storage
 */
export type PersistentEngine<V = unknown> = AvailableToCheckInStorageEngine<V> | UnavailableToCheckInStorageEngine<V>;

