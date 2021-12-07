"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PerfTimersRunner: true
};
Object.defineProperty(exports, "PerfTimersRunner", {
  enumerable: true,
  get: function () {
    return _runner.default;
  }
});

var _interface = require("../../../../core/perf/timer/impl/interface");

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

var _runner = _interopRequireDefault(require("../../../../core/perf/timer/impl/runner"));