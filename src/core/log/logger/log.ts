/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import logEngine from 'core/log/engines';
import * as env from 'core/env';
import { LogLevel, LogMessageOptions } from 'core/log/types';

interface LogRecord {
	context: string,
	logLevel?: LogLevel,
	details: unknown[],
}

let
	options,
	queue: LogRecord[] = [];

const setConfig = (val) => {
	options = {
		...val
	};

	options.patterns = (options.patterns || []).map((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

const
	defaultContext = 'global';

env.get('log').then(setConfig, setConfig);
env.event.on('set.log', setConfig);
env.event.on('remove.log', setConfig);

/**
 * Calls an appropriate log engine.
 * Enqueues log records until set options up and then logs them
 *
 * @param context - log record context
 * @param [details] - additional details. If it's a function, it will be called
 */
export default function log(context: string | LogMessageOptions, ...details: unknown[]): void {
	let
		logLevel: CanUndef<LogLevel>;

	if (!Object.isString(context)) {
		logLevel = context.logLevel;
		context = `${context.context || defaultContext}:${logLevel}`;

	} else {
		context = context || defaultContext;
	}

	if (!options) {
		queue.push({context, logLevel, details});
		return;
	}

	if (queue.length) {
		for (let i = 0; i < queue.length; i++) {
			const
				logRecord = queue[i];

			if (isAbleToLog(logRecord.context)) {
				details = prepareDetails(logRecord.details);
				logEngine(logRecord.context, logRecord.logLevel, ...details);
			}
		}

		queue = [];
	}

	if (isAbleToLog(context)) {
		details = prepareDetails(details);
		logEngine(context, logLevel, ...details);
	}
}

/**
 * Returns true if patterns allow to log a record with the specified context
 * @param context - context that's checking for ability to log
 */
function isAbleToLog(context: string): boolean {
	if (options.patterns) {
		for (let o = options.patterns, i = 0; i < o.length; i++) {
			if (o[i].test(context)) {
				return true;
			}
		}

		return false;
	}

	return true;
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
