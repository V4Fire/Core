/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogStylesConfig, StylesCache } from 'core/log/config/types';
import { LogLevel } from 'core/log';

/**
 * Creates styles object where each LogLevel's property merged with default property of log styles config
 * @param styles
 */
export function createStyleCache(styles?: LogStylesConfig): Nullable<StylesCache> {
	if (!styles) {
		return null;
	}

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

	configCache.getStyle = (logLevel?: LogLevel): Nullable<Dictionary> => {
		if (!configCache) {
			return null;
		}

		if (logLevel && configCache[logLevel] !== undefined) {
			return configCache[logLevel];
		}

		return configCache.default;
	};

	return configCache;
}
