/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import pipelines from 'core/log/curator/pipelines';

import { LogEvent } from 'core/log/middlewares';
import { LogMessageOpts } from 'core/log';
import { DEFAULT_LEVEL } from 'core/log/base';

const
	DEFAULT_CONTEXT = 'global';

/**
 * Sends data to every logging pipeline
 *
 * @param context
 * @param details
 */
export default function log(context: string | LogMessageOpts, ...details: unknown[]): void {
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

	let
		logDetails,
		logError: CanUndef<Error>;

	if (details[0] instanceof Error) {
		logError = details[0] as Error;
		details = details.slice(1);
	}

	const event: LogEvent = {
		context: logContext,

		level: logLevel,
		error: logError,

		get details(): unknown[] {
			if (logDetails) {
				return logDetails;
			}

			return logDetails = prepareDetails(details);
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
