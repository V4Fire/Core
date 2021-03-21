/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LogEvent } from 'core/log/middlewares/interface';

/**
 * Creates a log event with passed error
 * @param [error]
 */
export function createLogEvent(error?: Error): LogEvent {
	const
		additionals = {},
		level = error ? 'error' : 'info';

	return {
		context: `test:${level}`,
		level,
		additionals,
		details: additionals,
		error
	};
}

/**
 * Copies a log event and changes additionals object of the copy if it passed
 *
 * @param srcLogEvent - a log event that need to be copied
 * @param [additionals] - new object with additionals
 */
export function copyLogEvent(srcLogEvent: LogEvent, additionals?: Dictionary): LogEvent {
	const
		newAdditionals = additionals ?? {};

	return {
		context: srcLogEvent.context,
		level: srcLogEvent.level,
		additionals: newAdditionals,
		details: newAdditionals,
		error: srcLogEvent.error
	};
}
