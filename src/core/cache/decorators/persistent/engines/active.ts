/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';

import { activeEngineStoragePath } from 'core/cache/decorators/persistent/engines/const';
import { UnavailableToCheckInStorageEngine } from 'core/cache/decorators/persistent/engines/interface';

export class ActiveEngine<V> extends UnavailableToCheckInStorageEngine<V> {
	/**
	 * An object that stores the keys of all properties in the storage and their ttls
	 */
	protected storage: {[key: string]: number} = {};

	async initCache(cache: Cache<V>): Promise<void> {
		if (await this.kvStorage.has(activeEngineStoragePath)) {
			this.storage = (await this.kvStorage.get<{[key: string]: number}>(activeEngineStoragePath))!;
		} else {
			await this.kvStorage.set(activeEngineStoragePath, this.storage);
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
		await this.execTask(key, async () => {
			await this.kvStorage.set(key, value);

			this.storage[key] = ttl ?? Number.MAX_SAFE_INTEGER;
			const copyOfStorage = {...this.storage};
			await this.kvStorage.set(activeEngineStoragePath, copyOfStorage);
		});
	}

	async remove(key: string): Promise<void> {
		await this.execTask(key, async () => {
			await this.kvStorage.remove(key);

			await this.removeTTL(key);
		});
	}

	async removeTTL(key: string): Promise<void> {
		delete this.storage[key];
		const copyOfStorage = {...this.storage};
		await this.kvStorage.set(activeEngineStoragePath, copyOfStorage);
	}

	getCheckStorageState(): CanPromise<{available: false; checked: boolean}> {
		return {
			available: false,
			checked: true
		};
	}
}
