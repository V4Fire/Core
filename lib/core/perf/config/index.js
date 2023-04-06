"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getTimerEngine: true,
  createPredicates: true,
  mergeConfigs: true
};
exports.createPredicates = createPredicates;
exports.getTimerEngine = getTimerEngine;
exports.mergeConfigs = mergeConfigs;
var _const = require("../../../core/perf/const");
var _engines = _interopRequireDefault(require("../../../core/perf/timer/engines"));
var _const2 = require("../../../core/perf/config/const");
var _interface = require("../../../core/perf/config/interface");
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
function getTimerEngine(config) {
  return _engines.default[config.engine];
}
function createPredicates(filters) {
  return _const.GROUPS.reduce((acc, groupName) => {
    const groupFilters = createFilters(filters[groupName]);
    acc[groupName] = ns => {
      if (Object.isArray(groupFilters)) {
        if (groupFilters[_const2.EXCLUDE] === true) {
          return !groupFilters.some(filter => filter.test(ns));
        }
        return groupFilters.some(filter => filter.test(ns));
      }
      return groupFilters;
    };
    return acc;
  }, {});
}
function mergeConfigs(baseConfig, ...configs) {
  return Object.mixin({
    deep: true
  }, {}, baseConfig, ...configs);
}
function createFilters(filters) {
  if (filters == null || Object.isBoolean(filters)) {
    return filters ?? true;
  }
  if (Object.isArray(filters)) {
    return filters.map(filter => new RegExp(filter));
  }
  if (Object.isArray(filters.include)) {
    return filters.include.map(filter => new RegExp(filter));
  }
  if (filters.exclude == null) {
    return true;
  }
  const regexpFilter = filters.exclude.map(filter => new RegExp(filter));
  regexpFilter[_const2.EXCLUDE] = true;
  return regexpFilter;
}