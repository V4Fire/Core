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
	LIMIT = 500;

export default function sleep(): Promise<void> {
	return daemon.sleep(DELAY);
}
