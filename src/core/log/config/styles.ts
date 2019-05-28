/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogStylesConfig } from 'core/log/config/types';

/**
 * Creates styles object where each LogLevel's property merged with default property of log styles config
 * @param styles
 */
export function createStyleCache(styles?: LogStylesConfig): Nullable<LogStylesConfig> {
	if (!styles) {
		return null;
	}

	const
		keys = Object.keys(styles),
		configCache: LogStylesConfig = {default: {}};

	for (let i = 0; i < keys.length; i++) {
		const
			key = keys[i];

		configCache[key] = {
			...styles.default,
			...styles[key]
		};
	}

	return configCache;
}
