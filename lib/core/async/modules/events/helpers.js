"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEvent = isEvent;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is looks like an event object
 * @param value
 */
function isEvent(value) {
  return Object.isPlainObject(value) && Object.isString(value.event);
}