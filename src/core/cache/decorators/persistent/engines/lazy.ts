/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { AvailableToCheckInStorageEngine, StorageCheckState } from 'core/cache/decorators/persistent/engines/interface';
import { lazyEngineTTLPostfix } from 'core/cache/decorators/persistent/engines/const';

export class LazyEngine<V> extends AvailableToCheckInStorageEngine<V> {
	async getTTL(key: string): Promise<CanUndef<number>> {
		const ttl = await this.kvStorage.get<number>(`${key}${lazyEngineTTLPostfix}`);
		return ttl;
	}

	async set(key: string, value: V, ttl?: number): Promise<void> {
		await this.execTask(key, async () => {
			await this.kvStorage.set(key, value);

			if (ttl != null) {
				await this.kvStorage.set(`${key}${lazyEngineTTLPostfix}`, ttl);
			} else {
				await this.removeTTL(key);
			}
		});
	}

	async remove(key: string): Promise<void> {
		await this.execTask(key, async () => {
			await this.kvStorage.remove(key);

			await this.removeTTL(key);
		});
	}

	async removeTTL(key: string): Promise<void> {
		await this.kvStorage.remove(`${key}${lazyEngineTTLPostfix}`);
	}

	async get<T>(key: string): Promise<CanUndef<T>> {
		const res = await this.kvStorage.get<T>(key);
		return res;
	}

	getCheckStorageState(): CanPromise<StorageCheckState> {
		return {
			available: true,
			checked: true
		};
	}
}
