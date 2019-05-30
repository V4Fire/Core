/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogEvent } from 'core/log/middlewares';
import { LogLevel, LogMessageOptions } from 'core/log';
import pipelines from 'core/log/curator/pipelines';

const
	DEFAULT_CONTEXT = 'global',
	DEFAULT_LEVEL: LogLevel = 'info';

/**
 * Sends data to every logging pipeline
 * @param context
 * @param details
 */
export default function log(context: string | LogMessageOptions, ...details: unknown[]): void {
	let
		logContext: string,
		logLevel = DEFAULT_LEVEL;

	if (Object.isString(context)) {
		logContext = context || DEFAULT_CONTEXT;

	} else {
		logLevel = context.logLevel || DEFAULT_LEVEL;
		logContext = context.context || DEFAULT_CONTEXT;
	}

	logContext = `${logContext}:${logLevel}`;

	const
		logDetails = prepareDetails(details);

	const event: LogEvent = {
			context: logContext,
			level: logLevel,
			details: logDetails
		};

	for (let i = 0; i < pipelines.length; ++i) {
		pipelines[i].run(event);
	}
}

/**
 * Maps the specified details: executes functions and returns it result.
 * @param details
 */
function prepareDetails(details: unknown[]): unknown[] {
	for (let i = 0; i < details.length; i++) {
		const el = details[i];
		details[i] = Object.isFunction(el) ? el() : el;
	}

	return details;
}
