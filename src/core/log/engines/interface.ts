/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type engineFactory from 'core/log/engines';
import type { LogEvent } from 'core/log/middlewares/interface';

export interface LogEngineConstructor<T extends LogEngine> {
	new (opts?: Dictionary): T;
}

export interface LogEngine {
	log(event: LogEvent): void;
}

export type LogEngines = keyof typeof engineFactory;
