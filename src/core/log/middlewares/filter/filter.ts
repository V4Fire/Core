/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';
import type { LogFilter } from 'core/log/middlewares/filter/interface';

/**
 * Middleware to prevent unnecessary event logging
 */
export class FilterMiddleware implements LogMiddleware {
	protected readonly filters: LogFilter[] = [];

	constructor(...filters: LogFilter[]) {
		this.filters = filters;
	}

	/** @inheritDoc */
	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		if (!Object.isArray(events)) {
			events = [events];
		}

		if (this.filters.length > 0) {
			events = events.filter((event) =>
				this.filters.every((filter) => filter.check(event)));
		}

		if (events.length > 0) {
			next(events);
		}
	}
}
