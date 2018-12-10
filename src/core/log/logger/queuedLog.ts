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
import { LogLevel } from '../types';

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

export default function log(
	context: string,
	logLevel: LogLevel,
	errorOrMessage: Error | string,
	...details: unknown[])
	: void {
	let error: CanUndef<Error>;
	let message = '';

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

			if (this.isAbleToLog(logRecord.context)) {
				details = this.prepareDetails(logRecord.details);
				logEngine.log(logRecord.context, logRecord.logLevel, logRecord.message, logRecord.error, ...details);
			}
		}

		queue = [];
	}

	if (this.isAbleToLog(context)) {
		details = this.prepareDetails(details);
		logEngine.log(context, logLevel, message, error, ...details);
	}
}

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

function prepareDetails(details: unknown[]): unknown[] {
	for (let i = 0; i < details.length; i++) {
		const el = details[i];
		details[i] = Object.isFunction(el) ? el() : el;
	}

	return details;
}
