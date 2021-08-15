/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/log/middlewares/extractor/README.md]]
 * @packageDocumentation
 */

import type { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';

/**
 * Middleware for omitting duplicated errors
 */
export class DeduplicatorMiddleware implements LogMiddleware {
	/**
	 * Errors, that have already been occurred
	 */
	protected errorsDoubles: WeakSet<Error> = new WeakSet<Error>();

	/** @inheritDoc */
	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		if (Object.isArray(events)) {
			events = events.filter((event) => this.omitEvent(event));
			if (events.length > 0) {
				next(events);
			}

		} else if (!this.omitEvent(events)) {
			next(events);
		}
	}

	/**
	 * Returns `true` if an event has an error that's already occurred
	 * @param event - log event from a pipeline
	 */
	protected omitEvent(event: LogEvent): boolean {
		if (event.error != null) {
			if (this.errorsDoubles.has(event.error)) {
				return true;
			}

			this.errorsDoubles.add(event.error);
			return false;
		}

		return false;
	}
}
