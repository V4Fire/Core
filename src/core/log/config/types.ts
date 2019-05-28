/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogLevel } from 'core/log';

export interface LogConfig {
	flows?: LogFlowConfig[];
}

export interface LogFlowConfig {
	logger: string;
	engine: string;
	minimumLevel?: LogLevel;
	styles?: {[key in LogLevel | 'default']?: unknown};
}
