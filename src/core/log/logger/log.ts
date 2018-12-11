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
import { LogLevel } from 'core/log/types';

interface LogRecord {
	context: string,
	message: string,
	logLevel: LogLevel,
	error: CanUndef<Error>,
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
 * @param logLevel - log level
 * @param errorOrMessage - error or message to log
 * @param details - additional details. If it's a function then call it
 */
export default function log(
	context: string,
	logLevel: LogLevel,
	errorOrMessage: Error | string,
	...details: unknown[])
	: void {
	let error: CanUndef<Error>;
	let message = '';
	context = `${context || 'no-context'}:${logLevel}`;

	if (errorOrMessage instanceof Error) {
		error = errorOrMessage;

		if (Object.isString(details[0])) {
			message = <string>details[0];
			details = details.slice(1);
		}

	} else if (Object.isString(errorOrMessage)) {
		message = errorOrMessage;
	}

	if (!options) {
		queue.push({context, message, logLevel, error, details});
		return;
	}

	if (queue.length) {
		for (let i = 0; i < queue.length; i++) {
			const
				logRecord = queue[i];

			if (isAbleToLog(logRecord.context)) {
				details = prepareDetails(logRecord.details);
				logEngine.log(logRecord.context, logRecord.logLevel, logRecord.message, logRecord.error, ...details);
			}
		}

		queue = [];
	}

	if (isAbleToLog(context)) {
		details = prepareDetails(details);
		logEngine.log(context, logLevel, message, error, ...details);
	}
}

/**
 * Returns true if patterns allow to log record with specified context
 *
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
 *
 * @param details - details
 */
function prepareDetails(details: unknown[]): unknown[] {
	for (let i = 0; i < details.length; i++) {
		const el = details[i];
		details[i] = Object.isFunction(el) ? el() : el;
	}

	return details;
}
