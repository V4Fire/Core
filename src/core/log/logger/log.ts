/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
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
		patterns: [],
		...val
	};
	$C(options.patterns).set((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

env.get('log').then(setConfig, setConfig);
env.event.on('set.log', setConfig);
env.event.on('remove.log', setConfig);

/**
 * Call appropriate log engine. Enqueue log records until options set up and then log them.
 *
 * @param context - log record context
 * @param [details] - additional details. If it's a function then call it
 */
export default function log(context: string | LogMessageOptions, ...details: unknown[]): void {
	let
		logLevel: CanUndef<LogLevel>;

	if (!Object.isString(context)) {
		logLevel = context.logLevel;
		context = `${context.context || '--'}:${logLevel}`;
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
 * Returns true if patterns allow to log record with specified context
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
 * For each element in details array check whether it's a function.
 * If so then call it and set it's result in the array instead of the function.
 * If it's not a function then leave element as is.
 * @param details - details
 */
function prepareDetails(details: unknown[]): unknown[] {
	for (let i = 0; i < details.length; i++) {
		const el = details[i];
		details[i] = Object.isFunction(el) ? el() : el;
	}

	return details;
}
