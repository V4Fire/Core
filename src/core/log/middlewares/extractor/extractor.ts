/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import BaseError, { ErrorDetailsExtractor, ErrorCtor } from '@src/core/error';

import { DEPTH_LIMIT } from '@src/core/log/middlewares/extractor/const';

import type { LogEvent, LogMiddleware, NextCallback } from '@src/core/log/middlewares/interface';
import type { ErrorInfo } from '@src/core/log/middlewares/extractor/interface';

/**
 * Middleware to extract information from an error log event and store
 * it within the `additionals` dictionary of the event
 */
export class ExtractorMiddleware implements LogMiddleware {
	extractorsMap: Map<ErrorCtor<Error>, ErrorDetailsExtractor<Error>>;

	constructor(...extractors: Array<ErrorDetailsExtractor<Error>>) {
		this.extractorsMap = new Map(extractors.map((ext) => [ext.target, ext]));
	}

	/** @inheritDoc */
	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		if (Object.isArray(events)) {
			next(events.map((e) => this.processEvent(e)));

		} else {
			next(this.processEvent(events));
		}
	}

	/**
	 * Extracts error's details from the passed log event and stores it within the `additionals.error` property
	 * @param event - log event from a pipeline
	 */
	protected processEvent(event: LogEvent): LogEvent {
		if (event.error) {
			const
				error = this.generateErrorInfo(event.error);

			if (Object.size(error) > 0) {
				event.additionals.error = error;
			}
		}

		return event;
	}

	/**
	 * Returns an error's info structure
	 *
	 * @param error - error, which details should be returned
	 * @param isRoot - if false then adds `name` and `message` of the passed error to its info
	 * @param depthLimit - maximum depth of nested errors
	 */
	protected generateErrorInfo(error: Error, isRoot: boolean = true, depthLimit: number = DEPTH_LIMIT): ErrorInfo {
		const
			info: ErrorInfo = {};

		if (!isRoot) {
			info.error = {
				name: error.name,
				message: error.message
			};
		}

		const
			ctor = Object.getPrototypeOf(error).constructor;

		if (this.extractorsMap.has(ctor)) {
			info.details = this.extractorsMap.get(ctor)?.extract(error);

		} else {
			const details = Object.keys(error).reduce((obj, keyName) => {
				obj[keyName] = error[keyName];
				return obj;
			}, {});

			if (Object.size(details) > 0) {
				info.details = details;
			}
		}

		if (error instanceof BaseError && error.cause) {
			info.cause = depthLimit > 0 ? this.generateErrorInfo(error.cause, false, depthLimit - 1) : undefined;
		}

		return info;
	}
}
