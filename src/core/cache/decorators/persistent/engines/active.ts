/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import type Cache from 'core/cache/interface';

import { INDEX_STORAGE_NAME } from 'core/cache/decorators/persistent/engines/const';
import { UncheckablePersistentEngine } from 'core/cache/decorators/persistent/engines/interface';

export default class ActivePersistentEngine<V> extends UncheckablePersistentEngine<V> {

	override async initCache(cache: Cache<string, V>): Promise<void> {
		if (await this.storage.has(INDEX_STORAGE_NAME)) {
			this.ttlIndex = (await this.storage.get<Dictionary<number>>(INDEX_STORAGE_NAME))!;

		} else {
			await this.storage.set(INDEX_STORAGE_NAME, this.storage);
		}

		const
			time = Date.now();

		await Promise.allSettled(Object.keys(this.ttlIndex).map((key) => new Promise<void>(async (resolve) => {
			const
				ttl = this.ttlIndex[key];

			if (!Object.isNumber(ttl)) {
				return;
			}

			if (ttl > time) {
				const value = (await this.storage.get<V>(key))!;
				cache.set(key, value);

			} else {
				await this.remove(key);
			}

			resolve();
		})));
	}

	override async set(key: string, value: V, ttl?: number): Promise<void> {
		await this.execTask(key, async () => {
			const res = await this.storage.set(key, value);

			this.ttlIndex[key] = this.normalizeTTL(ttl);
			await this.storage.set(INDEX_STORAGE_NAME, Object.fastClone(this.ttlIndex));

			return res;
		});
	}

	override async remove(key: string): Promise<void> {
		await this.execTask(key, async () => {
			await this.storage.remove(key);
			await this.removeTTLFrom(key);
		});
	}

	override getTTLFrom(key: string): Promise<CanUndef<number>> {
		return SyncPromise.resolve(this.ttlIndex[key]);
	}

	override removeTTLFrom(key: string): Promise<boolean> {
		if (key in this.ttlIndex) {
			delete this.ttlIndex[key];
			return SyncPromise.resolve(this.storage.set(INDEX_STORAGE_NAME, Object.fastClone(this.ttlIndex)));
		}

		return SyncPromise.resolve(false);
	}

	override getCheckStorageState(): CanPromise<{available: false; checked: boolean}> {
		return {
			available: false,
			checked: true
		};
	}
}
