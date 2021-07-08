/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent } from 'core/log/middlewares/interface';
import type { LogFilter } from 'core/log/middlewares/filter/interface';
import { getLogOptions } from 'core/log/config';

/**
 * Filters events by context
 */
export default class ContextFilter implements LogFilter {

	/**
	 * Returns true if config patterns allow to log a record with the specified context
	 * @param event
	 */
	check(event: LogEvent): boolean {
		//#if runtime has core/log

		const
			logOps = getLogOptions();

		if (logOps?.patterns != null) {
			return logOps.patterns.some((pattern) => pattern.test(event.context));
		}

		//#endif

		return true;
	}
}
