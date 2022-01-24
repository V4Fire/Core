"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultToQueryStringParamsFilter = defaultToQueryStringParamsFilter;
exports.startSlashesRgxp = exports.isStrictAbsURL = exports.isAbsURL = exports.endSlashesRgxp = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const isAbsURL = /^(?:\w+:)?\/\//,
      isStrictAbsURL = /^\w+:\/\//;
exports.isStrictAbsURL = isStrictAbsURL;
exports.isAbsURL = isAbsURL;
const startSlashesRgxp = /^\/+/,
      endSlashesRgxp = /\/+$/;
/**
 * Default function to filter query parameters to serialize with the `toQueryString` method
 * @param value
 */

exports.endSlashesRgxp = endSlashesRgxp;
exports.startSlashesRgxp = startSlashesRgxp;

function defaultToQueryStringParamsFilter(value) {
  return !(value == null || value === '' || Object.isArray(value) && value.length === 0);
}