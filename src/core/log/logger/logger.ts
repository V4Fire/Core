/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import log from './queuedLog';
import { LogLevel } from '../types';

export default class Logger {
	private readonly globalContext: string;

	/**
	 * @param globalContext - if defined then context for each log record will be <globalContext>:<context>
	 */
	constructor(globalContext?: string) {
		this.globalContext = globalContext || '';
	}

	/**
	 * Log message with level 'info'
	 *
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	info(message: string, ...details: unknown[]): void {
		this.log(undefined, 'info', message, details);
	}

	/**
	 * Log message with level 'info' and specific context
	 *
	 * @param context - log record context
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	infoCtx(context: string, message: string, ...details: unknown[]): void {
		this.log(context, 'info', message, details);
	}

	/**
	 * Log message with level 'warn'
	 *
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	warn(message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'warn'
	 *
	 * @param error - error to log
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	warn(error: Error, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'warn'
	 *
	 * @param errorOrMessage - error or message to log
	 * @param [details] - additional details
	 */
	warn(errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(undefined, 'warn', errorOrMessage, details);
	}

	/**
	 * Log message with level 'warn' and specific context
	 *
	 * @param context - log record context
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	warnCtx(context: string, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'warn' and specific context
	 *
	 * @param context - log record context
	 * @param error - error to log
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	warnCtx(context: string, error: Error, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'warn' and specific context
	 *
	 * @param context - log record context
	 * @param errorOrMessage - error or message to log
	 * @param [details] - additional details
	 */
	warnCtx(context: string, errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(context, 'warn', errorOrMessage, details);
	}

	/**
	 * Log message with level 'error'
	 *
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	error(message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'error'
	 *
	 * @param error - error to log
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	error(error: Error, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'error'
	 *
	 * @param errorOrMessage - error or message to log
	 * @param [details] - additional details
	 */
	error(errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(undefined, 'error', errorOrMessage, details);
	}

	/**
	 * Log message with level 'error' and specific context
	 *
	 * @param context - log record context
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	errorCtx(context: string, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'error' and specific context
	 *
	 * @param context - log record context
	 * @param error - error to log
	 * @param message - message to log
	 * @param [details] - additional details
	 */
	errorCtx(context: string, error: Error, message: string, ...details: unknown[]): void;

	/**
	 * Log message with level 'error' and specific context
	 *
	 * @param context - log record context
	 * @param errorOrMessage - error or message to log
	 * @param [details] - additional details
	 */
	errorCtx(context: string, errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(context, 'error', errorOrMessage, details);
	}

	/**
	 * Internal logger
	 *
	 * @param context - log record context
	 * @param logLevel - log level
	 * @param errorOrMessage - error or message to log
	 * @param details - additional details
	 */
	private log(
		context: CanUndef<string>,
		logLevel: LogLevel,
		errorOrMessage: Error | string,
		...details: unknown[])
	: void {
		const currentContext
			= `${this.globalContext ? this.globalContext + ':' : ''}${context ? context + ':' : ''}${logLevel}`;

		log(currentContext, logLevel, errorOrMessage, details);
	}
}
