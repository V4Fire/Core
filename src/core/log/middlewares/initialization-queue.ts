/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';
import { getLogOptions } from 'core/log/config';

/**
 * Middleware to store events until the logging config is initialized
 */
export class InitializationQueueMiddleware implements LogMiddleware {
	protected queue: LogEvent[] = [];

	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		//#if runtime has core/log

		if (getLogOptions() == null) {
			if (Object.isArray(events)) {
				this.queue.push(...events);

			} else {
				this.queue.push(events);
			}

			return;
		}

		if (this.queue.length > 0) {
			if (!Object.isArray(events)) {
				events = [events];
			}

			events = events.concat(this.queue);
			this.queue = [];
		}

		next(events);

		//#endif
	}
}
