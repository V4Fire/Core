"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  $$: true,
  extend: true
};
exports.default = exports.$$ = void 0;
exports.extend = extend;
var _symbol = _interopRequireDefault(require("../core/symbol"));
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
const $$ = (0, _symbol.default)();
exports.$$ = $$;
const config = {
  get appName() {
    if ($$.appName in this) {
      return this[$$.appName];
    }
    return typeof APP_NAME !== 'undefined' ? APP_NAME : undefined;
  },
  set appName(value) {
    this[$$.appName] = value;
  },
  get locale() {
    if ($$.locale in this) {
      return this[$$.locale];
    }
    return typeof LOCALE !== 'undefined' ? LOCALE : undefined;
  },
  set locale(value) {
    this[$$.locale] = value;
  },
  get api() {
    if ($$.api in this) {
      return this[$$.api];
    }
    return typeof API_URL !== 'undefined' ? API_URL : undefined;
  },
  set api(value) {
    this[$$.api] = value;
  },
  online: {
    checkURL: '',
    checkInterval: 30 .seconds(),
    checkTimeout: 2 .seconds(),
    retryCount: 3,
    lastDateSyncInterval: 1 .minute(),
    persistence: true,
    cacheTTL: 1 .second()
  },
  kvStorage: {
    nodePath: './tmp/local'
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
function extend(...objects) {
  return Object.mixin({
    deep: true,
    skipUndefs: false,
    withDescriptors: true,
    concatArrays: (a, b) => a.union(b)
  }, config, ...objects);
}
var _default = config;
exports.default = _default;