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
 * Filters duplicated events
 */
export default class DuplicatesFilter implements LogFilter {
	/**
	 * Events that have already been shown
	 */
	protected readonly errorsSet: WeakSet<Error> = new WeakSet();

	check(event: LogEvent): boolean {
		//#if runtime has core/log

		if (event.error == null) {
			return true;
		}

		if (this.errorsSet.has(event.error)) {
			return false;
		}

		this.errorsSet.add(event.error);

		//#endif

		return true;
	}
}
