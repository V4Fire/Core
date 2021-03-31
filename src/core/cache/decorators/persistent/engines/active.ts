/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';
import { UnavailableToCheckInStorageEngine } from 'core/cache/decorators/persistent/engines/interface';
import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

const storagePath = '__storage__';

export class ActiveEngine<V> extends UnavailableToCheckInStorageEngine<V> {
	/**
	 * Storage object
	 */
	protected readonly kvStorage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * An object that stores the keys of all properties in the storage and their ttls
	 */
	protected storage: {[key: string]: number} = {};

	constructor(kvStorage: SyncStorageNamespace | AsyncStorageNamespace) {
		super();
		this.kvStorage = kvStorage;
	}

	async initCache(cache: Cache<V>): Promise<void> {
		if (await this.kvStorage.has(storagePath)) {
			this.storage = (await this.kvStorage.get<{[key: string]: number}>(storagePath))!;
		} else {
			await this.kvStorage.set(storagePath, this.storage);
		}

		const
			time = Date.now();

		await Promise.allSettled(Object.keys(this.storage).map((key) => {
			const promiseInitProp = new Promise<void>(async (resolve) => {
				if (this.storage[key] > time) {
					const value = (await this.kvStorage.get<V>(key))!;
					cache.set(key, value);
				} else {
					await this.remove(key);
				}

				resolve();
			});

			return promiseInitProp;
		}));
	}

	getTTL(key: string): number | undefined {
		return this.storage[key];
	}

	async set(key: string, value: V, ttl?: number): Promise<void> {
		try {
			await this.execTask(key, async () => {
				await this.kvStorage.set(key, value);

				this.storage[key] = ttl ?? Number.MAX_SAFE_INTEGER;
				const copyOfStorage = {...this.storage};
				await this.kvStorage.set(storagePath, copyOfStorage);
			});
		} catch(e) {}
	}

	async remove(key: string): Promise<void> {
		try {
			await this.execTask(key, async () => {
				await this.kvStorage.remove(key);

				delete this.storage[key];
				const copyOfStorage = {...this.storage};
				await this.kvStorage.set(storagePath, copyOfStorage);
			});
		} catch(e) {}
	}

	isNeedToCheckInStorage(): false {
		return false;
	}
}
