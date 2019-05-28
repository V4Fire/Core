/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogLevel, LogMessageOptions } from 'core/log';
import { LogEngine } from 'core/log/engines';

const
	defaultContext = 'global';

/**
 * Calls specified engine immediately
 *
 * @param context - log record context
 * @param engine
 * @param [details] - additional details (if it's a function, it will be called)
 */
export default function log(context: string | LogMessageOptions, engine: LogEngine, ...details: unknown[]): void {
	let
		logLevel: CanUndef<LogLevel>;

	if (Object.isString(context)) {
		context = context || defaultContext;

	} else {
		logLevel = context.logLevel;
		context = `${context.context || defaultContext}:${logLevel}`;
	}

	details = prepareDetails(details);
	engine(context, logLevel, ...details);
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
