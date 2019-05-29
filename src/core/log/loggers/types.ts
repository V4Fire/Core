/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogLevel, LogMessageOptions } from 'core/log';
import { LogEngine } from 'core/log/engines';

export interface InternalLogger {
	(context: string | LogMessageOptions, engine: LogEngine, ...details: unknown[]): void;
}

export interface LogEvent {
	readonly context: string;
	readonly level: LogLevel;
	readonly details?: unknown[];
	readonly error?: Error;
}

export interface NextCallback {
	(events: LogEvent | LogEvent[]): void;
}

export interface LogMiddleware {
	exec(events: LogEvent | LogEvent[], next: NextCallback): void;
}
