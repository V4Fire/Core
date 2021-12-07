"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultToQueryStringParamsFilter = defaultToQueryStringParamsFilter;
exports.isURLWithSlash = exports.isAbsURL = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const isAbsURL = /^(?:\w+:)?\/\//,
      isURLWithSlash = /^(?:\w+:)?\/+/;
/**
 * Default function to filter query parameters to serialize with the `toQueryString` method
 * @param value
 */

exports.isURLWithSlash = isURLWithSlash;
exports.isAbsURL = isAbsURL;

function defaultToQueryStringParamsFilter(value) {
  return !(value == null || value === '' || Object.isArray(value) && value.length === 0);
}