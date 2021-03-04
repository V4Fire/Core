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
	readonly details?: unknown[];
	readonly error?: Error;
}

export interface NextCallback {
	(events: CanArray<LogEvent>): void;
}

export interface LogMiddleware {
	/**
	 * Processes the events
	 * (if has data to pass to the next middleware, calls the next callback)
	 *
	 * @param events
	 * @param next
	 */
	exec(events: CanArray<LogEvent>, next: NextCallback): void;
}

export type LogMiddlewares = keyof typeof middlewareFactory;
