"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStyleCache = createStyleCache;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Creates an object of styles where each log level property merged with the default property of a log styles config
 * @param styles
 */
function createStyleCache(styles) {
  const keys = Object.keys(styles),
        configCache = {
    default: {}
  };

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    configCache[key] = { ...styles.default,
      ...styles[key]
    };
  }

  configCache.getStyle = logLevel => {
    if (configCache[logLevel]) {
      return configCache[logLevel];
    }

    return configCache.default;
  };

  return configCache;
}