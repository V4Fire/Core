/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import pipelines from 'core/log/curator/pipelines';

import type { LogEvent } from 'core/log/middlewares';
import type { LogMessageOptions } from 'core/log/interface';

import { DEFAULT_LEVEL } from 'core/log/base';

const
	DEFAULT_CONTEXT = 'global';

/**
 * Sends data to every logging pipeline
 *
 * @param context
 * @param details
 */
export default function log(context: string | LogMessageOptions, ...details: unknown[]): void {
	//#if runtime has core/log

	let
		logContext: string,
		logLevel = DEFAULT_LEVEL;

	if (Object.isString(context)) {
		logContext = context !== '' ? context : DEFAULT_CONTEXT;

	} else {
		logLevel = context.logLevel ?? DEFAULT_LEVEL;
		logContext = context.context !== '' ? context.context : DEFAULT_CONTEXT;
	}

	logContext = `${logContext}:${logLevel}`;

	let
		logDetails,
		logError: CanUndef<Error>;

	if (details[0] instanceof Error) {
		logError = details[0];
		details = details.slice(1);
	}

	const event: LogEvent = {
		context: logContext,

		level: logLevel,
		error: logError,

		additionals: {
			get details(): unknown[] {
				if (logDetails != null) {
					return logDetails;
				}

				return logDetails = prepareDetails(details);
			}
		}
	};

	for (let i = 0; i < pipelines.length; ++i) {
		try {
			pipelines[i].run(event);

		} catch (e) {
			// TODO: get rid of console
			console.error(e);
		}
	}

	//#endif
}

/**
 * Maps the specified details: executes functions and returns its result
 * @param details
 */
function prepareDetails(details: unknown[]): unknown[] {
	for (let i = 0; i < details.length; i++) {
		const el = details[i];
		details[i] = Object.isFunction(el) ? el() : el;
	}

	return details;
}
