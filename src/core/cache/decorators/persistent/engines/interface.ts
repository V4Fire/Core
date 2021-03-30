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
	abstract set(key: string, value: V, ttl?: number): CanPromise<void>;

	/**
	 * Remove value from storage
	 * @param key
	 */
	abstract remove(key: string): CanPromise<void>;

	protected setElementToStorage(key: string, value: V, callback?: () => CanPromise<void>): void {

	}

	protected removeElementFromStorage(key: string, callback?: () => CanPromise<void>): void {
		this.async.setImmediate(async () => {
			await this.kvStorage.remove(key);
			if (callback) {
				await callback();
			}
		}, {label: key});
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

