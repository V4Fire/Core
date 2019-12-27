/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogMessageOptions {
	context: string;
	logLevel?: LogLevel;
}

export interface Logger {
	(context: string | LogMessageOptions, ...details: unknown[]): void;
	(context: string | LogMessageOptions, error: Error, ...details: unknown[]): void;
}

export interface ExtendedLogger extends Logger {
	/**
	 * Logs a message with the info level and the specified context
	 *
	 * @param context - log record context
	 * @param [details] - additional details
	 */
	info(context: string, ...details: unknown[]): void;

	/**
	 * Logs a message with the warn level and the specified context
	 *
	 * @param context - log record context
	 * @param [details] - additional details
	 */
	warn(context: string, ...details: unknown[]): void;

	/**
	 * @param context - log record context
	 * @param error - thrown error
	 * @param [details] - additional details
	 */
	warn(context: string, error: Error, ...details: unknown[]): void;

	/**
	 * Logs a message with the error level and the specified context
	 *
	 * @param context - log record context
	 * @param [details] - additional details
	 */
	error(context: string, ...details: unknown[]): void;

	/**
	 * @param context - log record context
	 * @param error - thrown error
	 * @param [details] - additional details
	 */
	error(context: string, error: Error, ...details: unknown[]): void;

	/**
	 * Returns a new logging function with the specified namespace
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
