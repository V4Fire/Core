/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogEvent } from 'core/log/loggers';

export interface LogEngine {
	log(event: LogEvent): void;
}
