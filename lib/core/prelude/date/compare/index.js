"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

var _helpers = require("../../../../core/prelude/date/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[Date.is]] */
(0, _extend.default)(Date.prototype, 'is', function is(date, margin = 0) {
  return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});
/** @see [[DateConstructor.is]] */

(0, _extend.default)(Date, 'is', (0, _helpers.createStaticDateComparator)('is'));
/** @see [[Date.isPast]] */

(0, _extend.default)(Date.prototype, 'isPast', function isPast() {
  return this.valueOf() < Date.now();
});
/** @see [[DateConstructor.isPast]] */

(0, _extend.default)(Date, 'isPast', date => date.isPast());
/** @see [[Date.isFuture]] */

(0, _extend.default)(Date.prototype, 'isFuture', function isFuture() {
  return this.valueOf() > Date.now();
});
/** @see [[DateConstructor.isFuture]] */

(0, _extend.default)(Date, 'isFuture', date => date.isFuture());
/** @see [[Date.isAfter]] */

(0, _extend.default)(Date.prototype, 'isAfter', function isAfter(date, margin = 0) {
  return this.valueOf() > Date.create(date).valueOf() - margin;
});
/** @see [[DateConstructor.isAfter]] */

(0, _extend.default)(Date, 'isAfter', (0, _helpers.createStaticDateComparator)('isAfter'));
/** @see [[Date.isBefore]] */

(0, _extend.default)(Date.prototype, 'isBefore', function isBefore(date, margin = 0) {
  return this.valueOf() < Date.create(date).valueOf() + margin;
});
/** @see [[DateConstructor.isBefore]] */

(0, _extend.default)(Date, 'isBefore', (0, _helpers.createStaticDateComparator)('isBefore'));
/** @see [[Date.isBetween]] */

(0, _extend.default)(Date.prototype, 'isBetween', function isBetween(left, right, margin = 0) {
  const v = this.valueOf();
  return v >= Date.create(left).valueOf() - margin && v <= Date.create(right).valueOf() + margin;
});
/** @see [[DateConstructor.isBetween]] */

(0, _extend.default)(Date, 'isBetween', function isBetween(date, left, right, margin) {
  if (arguments.length < 3) {
    if (Object.isNumber(date)) {
      margin = date;
    } else {
      right = left;
      left = date;
    }

    return (date, l, r, m) => Date.isBetween(date, left ?? l, right ?? r, margin ?? m);
  }

  return Date.create(date).isBetween(left, right, margin ?? 0);
});