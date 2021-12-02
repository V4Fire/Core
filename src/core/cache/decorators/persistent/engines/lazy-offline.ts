/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { isOnline } from '@src/core/net';

import LazyPersistentEngine from '@src/core/cache/decorators/persistent/engines/lazy';
import type { StorageCheckState } from '@src/core/cache/decorators/persistent/engines/interface';

export default class LazyPersistentOfflineEngine<V> extends LazyPersistentEngine<V> {
	override async getCheckStorageState(): Promise<StorageCheckState> {
		const
			online = (await isOnline()).status;

		if (online) {
			return {
				available: false,
				checked: false
			};
		}

		return {
			available: true,
			checked: true
		};
	}
}
