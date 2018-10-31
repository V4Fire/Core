/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogPreferences, LogMessageOptions } from 'core/log';

/**
 * Prints the specified parameters to a console
 *
 * @param key - log key
 * @param type - type of the message
 * @param config - preferences for logging
 * @param [details]
 */
export default function log({key, type}: LogMessageOptions, config: LogPreferences, ...details: unknown[]): void {
	const
		style = config.styles && {...config.styles.default, ...(type ? config.styles[type] : {})};

	console.log(
		`%c${key}:`,

		$C(style).to('')
			.reduce((res, value, key) => res + `${key.dasherize()}:${value};`),

		...details
	);
}
