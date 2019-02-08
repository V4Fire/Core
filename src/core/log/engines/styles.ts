/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { LogLevel } from 'core/log/types';

const
	{styles} = config.log,
	configCache = {};

if (styles) {
	for (const key in styles) {
		if (key !== 'default') {
			configCache[key] = {
				...styles.default,
				...styles[key]
			};
		}
	}
}

/**
 * Returns object representing style for specific logLevel
 * @param [logLevel] - level of log which need style
 */
export function getStyle(logLevel?: LogLevel): Nullable<Dictionary> {
	if (logLevel && configCache[logLevel] !== undefined) {
		return configCache[logLevel];
	}

	return null;
}
