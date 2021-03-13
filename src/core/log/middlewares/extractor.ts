/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';
import type { ErrorDetailsExtractor, ErrorCtor } from 'core/error';
// tslint:disable-next-line:no-duplicate-imports
import { BaseError } from 'core/error';

export class ExtractorMiddleware implements LogMiddleware {
	extractorsMap: Map<ErrorCtor<Error>, ErrorDetailsExtractor<Error>>;

	constructor(...extractors: Array<ErrorDetailsExtractor<Error>>) {
		this.extractorsMap = new Map(extractors.map((ext) => [ext.target, ext]));
	}

	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		if (Object.isArray(events)) {
			next(events.map((e) => this.processEvent(e)));

		} else {
			next(this.processEvent(events));
		}
	}

	protected processEvent(event: LogEvent): LogEvent {
		if (event.error) {
			this.addErrorInfo(event.error, event.additionals);
		}

		return event;
	}

	protected addErrorInfo(error: Error, info: Dictionary, logError: boolean = false): void {
		if (logError) {
			info.error = {
				name: error.name,
				message: error.message
			};
		}

		const
			ctor = Object.getPrototypeOf(error).constructor;

		if (this.extractorsMap.has(ctor)) {
			info.errorDetails = this.extractorsMap.get(ctor)?.extract(error);
		}

		if (error instanceof BaseError && error.cause) {
			this.addErrorInfo(error.cause, (info.errorCause = {}), true);
		}
	}
}
