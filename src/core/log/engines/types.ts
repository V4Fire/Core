/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogEvent } from 'core/log/middlewares';
import engineStrategy from 'core/log/engines/index';

export interface LogEngine {
	log(event: LogEvent): void;
}

export type LogEngines = keyof typeof engineStrategy;
