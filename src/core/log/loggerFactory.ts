/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Logger from './logger';

class LoggerFactory {
	private loggers: {[context: string]: Logger} = {};

	public get(context?: string): Logger {
		context = context || '';

		if (!this.loggers[context]) {
			this.loggers[context] = new Logger(context);
		}

		return this.loggers[context];
	}
}

export default new LoggerFactory();
