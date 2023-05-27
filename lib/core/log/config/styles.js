"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStyleCache = createStyleCache;
function createStyleCache(styles) {
  const keys = Object.keys(styles),
    configCache = {
      default: {}
    };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    configCache[key] = {
      ...styles.default,
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