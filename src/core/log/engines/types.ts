/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import engineFactory from 'core/log/engines';
import { LogEvent } from 'core/log/middlewares';

export interface LogEngineConstructor<T extends LogEngine> {
	new (options?: Dictionary): T
}

export interface LogEngine {
	log(event: LogEvent): void;
}

export type LogEngines = keyof typeof engineFactory;
