/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogLevel } from 'core/log';

export interface Engine {
	(context: string, logLevel?: LogLevel, ...details: unknown[]): void;
}
