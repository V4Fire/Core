/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import internalLog from 'core/log/logger/log';
import { LogLevel, Logger, ExtendedLogger } from 'core/log/types';

const extend = (func: Logger): ExtendedLogger => {
	const res = <ExtendedLogger>func;

	function info(context: string, message: string): void {
		func(context, 'info', message);
	}
	res.info = info;

	function warn(context: string, errorOrMessage: Error | string, ...details: unknown[]): void {
		func(context, 'warn', errorOrMessage, details);
	}
	res.warn = warn;

	function error(context: string, errorOrMessage: Error | string, ...details: unknown[]): void {
		func(context, 'error', errorOrMessage, details);
	}
	res.error = error;

	function namespace(ns: string): ExtendedLogger {
		const that = this;
		const copy = (context: string, logLevel: LogLevel, messageOrError: Error | string, ...details: unknown[]): void =>
			that.call(this, `${ns}:${context}`, logLevel, messageOrError);
		return extend(copy);
	}
	res.namespace = namespace;

	return res;
};

export default extend(internalLog);
