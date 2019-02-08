/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import internalLog from 'core/log/logger/log';
import { Logger, ExtendedLogger, LogMessageOptions } from 'core/log/types';

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

	function namespace(ns: string): ExtendedLogger {
		const copy = (context: string | LogMessageOptions, ...details: unknown[]): void => {
			let
				contextCopy: string | LogMessageOptions;

			if (Object.isString(context)) {
				contextCopy = `${ns}:${context}`;

			} else {
				contextCopy = {
					context: `${ns}:${context.context}`,
					logLevel: context.logLevel
				};
			}

			func.call(func, contextCopy, ...details);
		};

		return extend(copy);
	}
	res.namespace = namespace;

	return res;
};

export default extend(internalLog);
