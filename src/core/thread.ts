/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

export const
	daemon = new Async(),
	DELAY = 15,
	LIMIT = 0.3.second();

/**
 * Stops the daemon for the specified delay
 */
export default function sleep(delay: number = DELAY): Promise<void> {
	return daemon.sleep(delay);
}
