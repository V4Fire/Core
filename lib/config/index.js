"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  extend: true
};
exports.default = void 0;
exports.extend = extend;

var _error = require("../core/request/error");

var _interface = require("../config/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:config/README.md]]
 * @packageDocumentation
 */
const config = {
  get appName() {
    return typeof APP_NAME !== 'undefined' ? APP_NAME : undefined;
  },

  get locale() {
    return typeof LOCALE !== 'undefined' ? LOCALE : undefined;
  },

  get api() {
    return typeof API_URL !== 'undefined' ? API_URL : undefined;
  },

  online: {
    checkURL: '',
    checkInterval: 5 .seconds(),
    cacheTTL: 0.3.second(),
    checkTimeout: 2 .seconds(),
    retryCount: 3,
    persistence: true,
    lastDateSyncInterval: 1 .minute()
  },
  log: {
    pipelines: [{
      middlewares: ['errorsDeduplicator', 'configurable', ['extractor', [new _error.RequestErrorDetailsExtractor()]]],
      engine: 'console',
      engineOptions: {
        default: {
          fontSize: '13px',
          padding: '3px',
          marginBottom: '3px'
        },
        warn: {
          backgroundColor: '#FFCE00',
          color: '#FFF'
        },
        error: {
          backgroundColor: '#FF3B5B',
          color: '#FFF'
        }
      }
    }]
  },
  perf: {
    timer: {
      engine: 'console'
    }
  }
};
/**
 * Extends the config object with additional objects
 * @param objects
 */

function extend(...objects) {
  return Object.mixin({
    deep: true,
    skipUndefs: false,
    concatArrays: (a, b) => a.union(b)
  }, config, ...objects);
}

var _default = config;
exports.default = _default;