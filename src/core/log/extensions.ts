/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Logger, ExtendedLogger, LogMessageOptions } from 'core/log/interface';

const extend = (func: Logger): ExtendedLogger => {
	const res = <ExtendedLogger>func;

	function info(context: string, ...details: unknown[]): void {
		func({context, logLevel: 'info'}, ...details);
	}

	res.info = info;

	function warn(context: string, ...details: unknown[]): void {
		func({context, logLevel: 'warn'}, ...details);
	}

	res.warn = warn;

	function error(context: string, ...details: unknown[]): void {
		func({context, logLevel: 'error'}, ...details);
	}

	res.error = error;

	function namespace(value: string): ExtendedLogger {
		const copy = (context: string | LogMessageOptions, ...details: unknown[]): void => {
			let
				contextCopy: string | LogMessageOptions;

			if (Object.isString(context)) {
				contextCopy = `${value}:${context}`;

			} else {
				contextCopy = {
					context: `${value}:${context.context}`,
					logLevel: context.logLevel
				};
			}

			func(contextCopy, ...details);
		};

		return extend(copy);
	}

	res.namespace = namespace;
	return res;
};

export default extend;
