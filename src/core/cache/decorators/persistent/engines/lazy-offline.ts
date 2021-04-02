/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { isOnline } from 'core/net';

import LazyEngine from 'core/cache/decorators/persistent/engines/lazy';
import type { StorageCheckState } from 'core/cache/decorators/persistent/engines/interface';

export default class LazyOfflineEngine<V> extends LazyEngine<V> {
	/** @override */
	async getCheckStorageState(): Promise<StorageCheckState> {
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
