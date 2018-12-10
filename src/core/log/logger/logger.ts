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

	constructor(globalContext?: string) {
		this.globalContext = globalContext || '';
	}

	info(message: string, ...details: unknown[]): void {
		this.log(undefined, 'info', message, details);
	}

	infoCtx(context: string, message: string, ...details: unknown[]): void {
		this.log(context, 'info', message, details);
	}

	warn(message: string, ...details: unknown[]): void;
	warn(error: Error, message: string, ...details: unknown[]): void;
	warn(errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(undefined, 'warn', errorOrMessage, details);
	}

	warnCtx(context: string, message: string, ...details: unknown[]): void;
	warnCtx(context: string, error: Error, message: string, ...details: unknown[]): void;
	warnCtx(context: string, errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(context, 'warn', errorOrMessage, details);
	}

	error(message: string, ...details: unknown[]): void;
	error(error: Error, message: string, ...details: unknown[]): void;
	error(errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(undefined, 'error', errorOrMessage, details);
	}

	errorCtx(context: string, message: string, ...details: unknown[]): void;
	errorCtx(context: string, error: Error, message: string, ...details: unknown[]): void;
	errorCtx(context: string, errorOrMessage: Error | string, ...details: unknown[]): void {
		this.log(context, 'error', errorOrMessage, details);
	}

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
