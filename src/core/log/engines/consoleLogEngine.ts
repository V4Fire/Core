/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { LogLevel, LogPreferences } from '../types';

class ConsoleLogEngine {
	private config: LogPreferences;

	constructor(config: LogPreferences) {
		this.config = config;
	}

	/**
	 * Prints the specified parameters to a console
	 *
	 * @param context - logging context
	 * @param logLevel - level of current logging record
	 * @param message - logging message
	 * @param [error] - exception that's going to be logged
	 * @param [details] - additional details
	 */
	public log(context: string, logLevel: LogLevel, message: string, error?: Error, ...details: unknown[]): void {
		const
			style = this.config.styles && {...this.config.styles.default, ...this.config.styles[logLevel]};

		console.log(
			`%c${context}:`,

			$C(style).to('')
				.reduce((res, value, key) => res + `${key.dasherize()}:${value};`),

			...details
		);
	}
}

export default new ConsoleLogEngine(config);
