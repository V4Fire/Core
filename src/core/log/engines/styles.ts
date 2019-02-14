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
	configCache = {default: {}};

if (styles) {
	const
		keys = Object.keys(styles);

	for (let i = 0; i < keys.length; i++) {
		const
			key = keys[i];

		configCache[key] = {
			...styles.default,
			...styles[key]
		};
	}
}

/**
 * Returns an object representing style for the specific logLevel
 * @param [logLevel] - level of log which needs a style
 */
export function getStyle(logLevel?: LogLevel): Dictionary {
	if (logLevel && configCache[logLevel] !== undefined) {
		return configCache[logLevel];
	}

	return configCache.default;
}
