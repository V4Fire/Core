/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';
import { LogEvent, LogMiddleware, NextCallback } from 'core/log/loggers/types';

interface LogOptions {
	patterns?: RegExp[];
}

let
	options: LogOptions;

const setConfig = (opts) => {
	options = {
		...opts
	};

	options.patterns = (options.patterns || []).map((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

env.get('log').then(setConfig, setConfig);
env.event.on('set.log', setConfig);
env.event.on('remove.log', setConfig);

export class ConfigurableMiddleware implements LogMiddleware {
	private queue: LogEvent[] = [];

	exec(events: LogEvent | LogEvent[], next: NextCallback): void {
		if (!options) {
			if (Array.isArray(events)) {
				this.queue.push(...events);

			} else {
				this.queue.push(events);
			}
			return;
		}

		if (this.queue.length) {
			const
				queuedEvents = this.queue.filter((e) => this.filterContext(e.context));

			if (queuedEvents.length) {
				next(queuedEvents);
			}

			this.queue = [];
		}

		if (Array.isArray(events)) {
			const
				filteredEvents = events.filter((e) => this.filterContext(e.context));

			if (filteredEvents.length) {
				next(filteredEvents);
			}

		} else {
			if (this.filterContext(events.context)) {
				next(events);
			}
		}
	}

	/**
	 * Returns true if patterns allow to log a record with the specified context
	 * @param context
	 */
	private filterContext(context: string): boolean {
		if (options.patterns) {
			for (let patterns = options.patterns, i = 0; i < patterns.length; i++) {
				if (patterns[i].test(context)) {
					return true;
				}
			}

			return false;
		}

		return true;
	}
}
