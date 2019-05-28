/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogMessageOptions } from 'core/log';
import { LogEngine } from 'core/log/engines';

export interface InternalLogger {
	(context: string | LogMessageOptions, engine: LogEngine, ...details: unknown[]): void;
}
