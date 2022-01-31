/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type middlewareFactory from 'core/log/middlewares';
import type { LogLevel } from 'core/log/interface';

export interface LogEvent {
	readonly context: string;
	readonly level: LogLevel;
	readonly additionals: Dictionary;
	readonly error?: Error;

	/**
	 *  @deprecated
	 *  @see additionals
	 */
	readonly details: Dictionary;
}

export interface NextCallback {
	(events: CanArray<LogEvent>): void;
}

export interface LogMiddleware {
	/**
	 * Processes the events
	 * (if it has data to pass to the next middleware, calls the next callback)
	 *
	 * @param events
	 * @param next
	 */
	exec(events: CanArray<LogEvent>, next: NextCallback): void;
}

export type LogMiddlewaresName = keyof typeof middlewareFactory;

export type LogMiddlewares = LogMiddlewaresName | LogMiddlewaresTuple<LogMiddlewaresName>;

export type LogMiddlewaresTuple<K extends LogMiddlewaresName> = [K, CtorArgs<typeof middlewareFactory[K]>];

export type CtorArgs<T extends (...args: any[]) => any> = T extends (...args: infer A) => ReturnType<T> ? A : never;
