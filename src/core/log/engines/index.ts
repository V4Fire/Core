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
		style = config.styles ? <Dictionary>{...config.styles.default, ...type ? config.styles[type] : {}} : {};

	let
		str = '';

	for (let keys = Object.keys(style), i = 0; i < keys.length; i++) {
		const key = keys[i];
		str += `${key.dasherize()}:${style[key]};`;
	}

	console.log(`%c${key}:`, str, ...details);
}
