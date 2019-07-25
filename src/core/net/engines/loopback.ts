/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { NetStatus } from 'core/net/interface';

/**
 * Loopback for online checking
 */
export function isOnline(): Promise<NetStatus> {
	return Promise.resolve({
		status: true,
		lastOnline: new Date()
	});
}
