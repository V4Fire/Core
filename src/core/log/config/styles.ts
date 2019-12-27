/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogStylesConfig, StylesCache } from 'core/log/config/interface.js';
import { LogLevel } from 'core/log';

/**
 * Creates an object of styles where each log level property merged with the default property of a log styles config
 * @param styles
 */
export function createStyleCache(styles: LogStylesConfig): StylesCache {
	const
		keys = Object.keys(styles),
		configCache = <StylesCache>{default: {}};

	for (let i = 0; i < keys.length; i++) {
		const
			key = keys[i];

		configCache[key] = {
			...styles.default,
			...styles[key]
		};
	}

	configCache.getStyle = (logLevel: LogLevel): CanUndef<Dictionary> => {
		if (configCache[logLevel]) {
			return configCache[logLevel];
		}

		return configCache.default;
	};

	return configCache;
}
