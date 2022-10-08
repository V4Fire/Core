/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';

import { TTL_POSTFIX } from 'core/cache/decorators/persistent/engines/const';
import { CheckablePersistentEngine, StorageCheckState } from 'core/cache/decorators/persistent/engines/interface';

export default class LazyPersistentEngine<V> extends CheckablePersistentEngine<V> {
	override get<T>(key: string): Promise<CanUndef<T>> {
		return SyncPromise.resolve(this.storage.get(key));
	}

	override async set(key: string, value: V, ttl?: number): Promise<void> {
		await this.execTask(key, async () => {
			try {
				await this.storage.set(key, value);

			} finally {
				if (ttl != null) {
					const
						normalizedTTL = this.normalizeTTL(ttl);

					await this.storage.set(key + TTL_POSTFIX, normalizedTTL);
					this.ttlIndex[key] = normalizedTTL;
				} else {
					await this.removeTTLFrom(key);
				}
			}
		});
	}

	override async remove(key: string): Promise<void> {
		await this.execTask(key, async () => {
			try {
				await this.storage.remove(key);

			} finally {
				await this.removeTTLFrom(key);
			}
		});
	}

	override getTTLFrom(key: string): Promise<CanUndef<number>> {
		return SyncPromise.resolve(this.storage.get(key + TTL_POSTFIX));
	}

	override removeTTLFrom(key: string): Promise<boolean> {
		const
			ttlKey = key + TTL_POSTFIX;

		return SyncPromise.resolve(this.storage.has(ttlKey)).then((res) => {
			if (res) {
				return SyncPromise.resolve(this.storage.remove(ttlKey)).then(() => true);
			}

			return false;
		});
	}

	override getCheckStorageState(): CanPromise<StorageCheckState> {
		return {
			available: true,
			checked: true
		};
	}
}
