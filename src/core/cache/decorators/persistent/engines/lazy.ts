/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { AvailableToCheckInStorageEngine } from 'core/cache/decorators/persistent/engines/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

const ttlPostfix = '__ttl';

export class LazyEngine<V> extends AvailableToCheckInStorageEngine<V> {
	/**
	 * Storage object
	 */
	protected readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;

	constructor(kvStorage: SyncStorageNamespace | AsyncStorageNamespace) {
		super();
		this.kvStorage = kvStorage;
	}

	async getTTL(key: string): Promise<number | undefined> {
		const ttl = await this.kvStorage.get<number>(`${key}${ttlPostfix}`);
		return ttl;
	}

	async set(key: string, value: V, ttl?: number): Promise<void> {
		try {
			await this.execTask(key, async () => {
				await this.kvStorage.set(key, value);

				if (ttl != null) {
					await this.kvStorage.set(`${key}${ttlPostfix}`, ttl);
				} else {
					await this.kvStorage.remove(`${key}${ttlPostfix}`);
				}
			});
		} catch(e) {}
	}

	async remove(key: string): Promise<void> {
		try {
			await this.execTask(key, async () => {
				await this.kvStorage.remove(key);

				await this.kvStorage.remove(`${key}${ttlPostfix}`);
			});
		} catch(e) {}
	}

	async get<T>(key: string): Promise<T | undefined> {
		const res = await this.kvStorage.get<T>(key);
		return res;
	}

	isNeedToCheckInStorage(): CanPromise<boolean> {
		return true;
	}
}
