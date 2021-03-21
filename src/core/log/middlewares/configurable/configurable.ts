/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';
import type { Options } from 'core/log/middlewares/configurable/interface';
import { getOptions } from 'core/log/middlewares/configurable/subscribe';

export class ConfigurableMiddleware implements LogMiddleware {
	protected queue: LogEvent[] = [];

	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		//#if runtime has core/log

		const
			logOps = getOptions();

		if (logOps == null) {
			if (Array.isArray(events)) {
				this.queue.push(...events);

			} else {
				this.queue.push(events);
			}

			return;
		}

		if (this.queue.length > 0) {
			const
				queuedEvents = <LogEvent[]>[];

			for (let o = this.queue, i = 0; i < o.length; i++) {
				const
					el = o[i];

				if (this.filterContext(el.context, logOps)) {
					queuedEvents.push(el);
				}
			}

			if (queuedEvents.length > 0) {
				next(queuedEvents);
			}

			this.queue = [];
		}

		if (Array.isArray(events)) {
			const
				filteredEvents = <LogEvent[]>[];

			for (let o = events, i = 0; i < o.length; i++) {
				const
					el = o[i];

				if (this.filterContext(el.context, logOps)) {
					filteredEvents.push(el);
				}
			}

			if (filteredEvents.length > 0) {
				next(filteredEvents);
			}

		} else if (this.filterContext(events.context, logOps)) {
			next(events);
		}

		//#endif
	}

	/**
	 * Returns true if config patterns allow to log a record with the specified context
	 *
	 * @param context
	 * @param logOps
	 */
	protected filterContext(context: string, logOps?: Options): boolean {
		//#if runtime has core/log

		if (logOps?.patterns) {
			for (let {patterns} = logOps, i = 0; i < patterns.length; i++) {
				if (patterns[i].test(context)) {
					return true;
				}
			}

			return false;
		}

		//#endif

		return true;
	}
}
