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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/perf/config/README.md]]
 * @packageDocumentation
 */

/**
 * Returns an instance of the timer engine that defined in the performance config
 * @param config - performance config
 */
function getTimerEngine(config) {
  return _engines.default[config.engine];
}
/**
 * Creates filter predicates for every group
 * @param filters - filters from the performance config
 */


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
/**
 * Combines the passed configs together
 *
 * @param baseConfig - base config, that has all required fields
 * @param configs - additional configs, that override fields of the base one
 */


function mergeConfigs(baseConfig, ...configs) {
  return Object.mixin({
    deep: true
  }, {}, baseConfig, ...configs);
}
/**
 * Preprocesses raw performance config filters and returns a collection of RegExp or Boolean values
 * @param filters - raw performance config filters
 */


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