"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _helpers = require("../../../../core/prelude/date/helpers");
(0, _extend.default)(Date.prototype, 'is', function is(date, margin = 0) {
  return Math.abs(this.valueOf() - Date.create(date).valueOf()) <= margin;
});
(0, _extend.default)(Date, 'is', (0, _helpers.createStaticDateComparator)('is'));
(0, _extend.default)(Date.prototype, 'isPast', function isPast() {
  return this.valueOf() < Date.now();
});
(0, _extend.default)(Date, 'isPast', date => date.isPast());
(0, _extend.default)(Date.prototype, 'isFuture', function isFuture() {
  return this.valueOf() > Date.now();
});
(0, _extend.default)(Date, 'isFuture', date => date.isFuture());
(0, _extend.default)(Date.prototype, 'isAfter', function isAfter(date, margin = 0) {
  return this.valueOf() > Date.create(date).valueOf() - margin;
});
(0, _extend.default)(Date, 'isAfter', (0, _helpers.createStaticDateComparator)('isAfter'));
(0, _extend.default)(Date.prototype, 'isBefore', function isBefore(date, margin = 0) {
  return this.valueOf() < Date.create(date).valueOf() + margin;
});
(0, _extend.default)(Date, 'isBefore', (0, _helpers.createStaticDateComparator)('isBefore'));
(0, _extend.default)(Date.prototype, 'isBetween', function isBetween(left, right, margin = 0) {
  const v = this.valueOf();
  return v >= Date.create(left).valueOf() - margin && v <= Date.create(right).valueOf() + margin;
});
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