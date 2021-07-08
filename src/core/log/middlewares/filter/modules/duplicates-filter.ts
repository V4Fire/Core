/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent } from 'core/log/middlewares/interface';
import type { LogFilter } from 'core/log/middlewares/filter/interface';

/**
 * Removes duplicated events
 */
export default class DuplicatesFilter implements LogFilter {
	protected readonly errorsMap: WeakMap<Error, 1> = new WeakMap();

	check(event: LogEvent): boolean {
		//#if runtime has core/log

		if (event.error == null) {
			return true;
		}

		if (this.errorsMap.has(event.error)) {
			return false;
		}

		this.errorsMap.set(event.error, 1);

		//#endif

		return true;
	}
}
