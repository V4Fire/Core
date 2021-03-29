/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LazyEngine } from 'core/cache/decorators/persistent/engines/lazy';
import { isOnline } from 'core/net';

export class LazyOfflineEngine<V> extends LazyEngine<V> {
	async isNeedToCheckInStorage(): Promise<boolean> {
		const
			online = (await isOnline()).status;

		return !online;
	}
}
