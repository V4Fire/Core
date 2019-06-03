/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type LogLevel = 'info' | 'warn' | 'error';
type LogLevelOrder = {[K in LogLevel]: number};

const order: LogLevelOrder = {
	error: 1,
	warn: 2,
	info: 3
};

/**
 * Compares log levels.
 * If left < right returns < 0.
 * If left > right returns > 0.
 * If left === right returns 0.
 * @param left
 * @param right
 */
export function cmpLevel(left: LogLevel, right: LogLevel): number {
	if (!order[left] && !order[right]) {
		return 0;

	} else if (!order[left]) {
		return -1;

	} else if (!order[right]) {
		return 1;
	}

	return order[left] - order[right];
}

export interface LogMessageOptions {
	context: string;
	logLevel?: LogLevel;
}

export interface Logger {
	(context: string | LogMessageOptions, ...details: unknown[]): void;
}

export interface ExtendedLogger extends Logger {
	/**
	 * Logs message with an info level and a context
	 *
	 * @param context - log record context
	 * @param [details] - additional details
	 */
	info(context: string, ...details: unknown[]): void;

	/**
	 * Logs message with a warn level and a context
	 *
	 * @param context - log record context
	 * @param [details] - additional details
	 */
	warn(context: string, ...details: unknown[]): void;

	/**
	 * Logs message with an error level and a context
	 *
	 * @param context - log record context
	 * @param [details] - additional details
	 */
	error(context: string, ...details: unknown[]): void;

	/**
	 * Returns a new log function with the specified namespace
	 *
	 * @example
	 * const log2 = log.namespace('global');
	 * log2.info('res', 'hello');
	 * // prints context 'global:res'
	 *
	 * @example
	 * const log3 = log.namespace('super').namespace('global');
	 * log3.info('res', 'hello');
	 * // prints context 'super:global:res'
	 *
	 * @param value
	 */
	namespace(value: string): ExtendedLogger;
}
