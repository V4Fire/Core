"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  perf: true
};
exports.default = void 0;
exports.perf = perf;

var _config = _interopRequireDefault(require("../../config"));

var _timer = require("../../core/perf/timer");

var _config2 = require("../../core/perf/config");

var _interface = require("../../core/perf/interface");

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

var _interface2 = require("../../core/perf/timer/impl/interface");

Object.keys(_interface2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface2[key];
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
 * [[include:core/perf/README.md]]
 * @packageDocumentation
 */

/**
 * Returns a configured instance of the `Perf` class
 * @param [perfConfig] - config that overrides the default performance config fields {@see config.perf}
 */
function perf(perfConfig) {
  const workingConfig = perfConfig == null ? _config.default.perf : (0, _config2.mergeConfigs)(_config.default.perf, perfConfig),
        factory = (0, _timer.getTimerFactory)(workingConfig.timer);
  return {
    getTimer: factory.getTimer.bind(factory),
    getScopedTimer: factory.getScopedTimer.bind(factory)
  };
}

const defaultPerf = perf();
var _default = defaultPerf;
exports.default = _default;