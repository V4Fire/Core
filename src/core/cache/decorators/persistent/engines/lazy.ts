/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { AvailableToCheckInStorageEngine } from 'core/cache/decorators/persistent/engines/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';
import { StorageManager } from 'core/cache/decorators/persistent/helpers';

const ttlPostfix = '__ttl';

export class LazyEngine<V> implements AvailableToCheckInStorageEngine<V> {
	/**
	 * Storage object
	 */
	protected readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Used for saving and deleting properties from storage
	 */
	protected readonly StorageManager: StorageManager;

	constructor(kvStorage: SyncStorageNamespace | AsyncStorageNamespace) {
		this.kvStorage = kvStorage;
		this.StorageManager = new StorageManager(kvStorage);
	}

	async getTTL(key: string): Promise<number | undefined> {
		const ttl = await this.kvStorage.get<number>(`${key}${ttlPostfix}`);
		return ttl;
	}

	async set(key: string, value: V, ttl?: number): Promise<void> {
		await this.StorageManager.set(key, value, () => {
			if (ttl != null) {
				this.StorageManager.set(`${key}${ttlPostfix}`, ttl);
			} else {
				this.StorageManager.remove(`${key}${ttlPostfix}`);
			}
		});
	}

	async remove(key: string): Promise<void> {
		await this.StorageManager.remove(key, () => {
			this.StorageManager.remove(`${key}${ttlPostfix}`);
		});
	}

	async get<T>(key: string): Promise<T | undefined> {
		const res = await this.kvStorage.get<T>(key);
		return res;
	}

	isNeedToCheckInStorage(): CanPromise<boolean> {
		return true;
	}
}
