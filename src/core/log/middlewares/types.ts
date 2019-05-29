/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogLevel } from 'core/log';

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
