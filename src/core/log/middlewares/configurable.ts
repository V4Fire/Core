/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';
import { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';

interface LogOptions {
	patterns: RegExp[];
}

let
	logOps: LogOptions;

const setConfig = (opts) => {
	logOps = {
		patterns: [':error\\b'],
		...opts
	};

	logOps.patterns = (logOps.patterns || []).map((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

env.get('log').then(setConfig, setConfig);
env.emitter.on('set.log', setConfig);
env.emitter.on('remove.log', setConfig);

export class ConfigurableMiddleware implements LogMiddleware {
	protected queue: LogEvent[] = [];

	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		//#if runtime has core/log

		if (!logOps) {
			if (Array.isArray(events)) {
				this.queue.push(...events);

			} else {
				this.queue.push(events);
			}

			return;
		}

		if (this.queue.length) {
			const
				queuedEvents = <LogEvent[]>[];

			for (let o = this.queue, i = 0; i < o.length; i++) {
				const
					el = o[i];

				if (this.filterContext(el.context)) {
					queuedEvents.push(el);
				}
			}

			if (queuedEvents.length) {
				next(queuedEvents);
			}

			this.queue = [];
		}

		if (Array.isArray(events)) {
			const
				filteredEvents = <LogEvent[]>[];

			for (let o = this.filterContext, i = 0; i < o.length; i++) {
				const
					el = o[i];

				if (this.filterContext(el.context)) {
					filteredEvents.push(el);
				}
			}

			if (filteredEvents.length) {
				next(filteredEvents);
			}

		} else {
			if (this.filterContext(events.context)) {
				next(events);
			}
		}

		//#endif
	}

	/**
	 * Returns true if config patterns allow to log a record with the specified context
	 * @param context
	 */
	protected filterContext(context: string): boolean {
		//#if runtime has core/log

		if (logOps.patterns) {
			for (let patterns = logOps.patterns, i = 0; i < patterns.length; i++) {
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
