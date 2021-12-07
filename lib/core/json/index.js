"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertIfDate = convertIfDate;

var _const = require("../../core/prelude/date/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/README.md]]
 * @packageDocumentation
 */
const minDateLength = '2017-02-03'.length;
/**
 * Reviver for the `JSON.parse` method: converts all strings that is looks like a date to Date
 *
 * @param key
 * @param value
 *
 * @example
 * ```js
 * JSON.parse('"2015-10-12"', convertIfDate) instanceof Date // true
 * ```
 */

function convertIfDate(key, value) {
  if (Object.isString(value) && value.length >= minDateLength && RegExp.test(_const.isDateStr, value)) {
    const date = Date.create(value);
    return isNaN(date.valueOf()) ? value : date;
  }

  return value;
}