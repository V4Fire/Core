"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRelative = getRelative;
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
(0, _extend.default)(Date.prototype, 'relative', function relative() {
  return getRelative(this, new Date());
});
(0, _extend.default)(Date, 'relative', date => Date.create(date).relative());
(0, _extend.default)(Date.prototype, 'relativeTo', function relativeTo(date) {
  return getRelative(this, date);
});
(0, _extend.default)(Date, 'relativeTo', function relativeTo(from, to) {
  if (arguments.length === 1) {
    const d = Date.create(from);
    return date2 => d.relativeTo(date2);
  }
  return Date.create(from).relativeTo(to);
});
function getRelative(from, to) {
  const diff = Date.create(to).valueOf() - Date.create(from).valueOf();
  const intervals = [{
    type: 'milliseconds',
    bound: 1e3
  }, {
    type: 'seconds',
    bound: 1e3 * 60
  }, {
    type: 'minutes',
    bound: 1e3 * 60 * 60
  }, {
    type: 'hours',
    bound: 1e3 * 60 * 60 * 24
  }, {
    type: 'days',
    bound: 1e3 * 60 * 60 * 24 * 7
  }, {
    type: 'weeks',
    bound: 1e3 * 60 * 60 * 24 * 30
  }, {
    type: 'months',
    bound: 1e3 * 60 * 60 * 24 * 365
  }];
  for (let i = 0; i < intervals.length; i++) {
    const {
      type,
      bound
    } = intervals[i];
    if (Math.abs(diff) < bound) {
      const value = diff / (i > 0 ? intervals[i - 1].bound : 1),
        tail = parseInt(value.toFixed(2).split('.')[1], 10);
      return {
        type: type,
        value: tail > 95 ? Math.round(value) : Math.floor(value),
        diff
      };
    }
  }
  return {
    type: 'years',
    value: Math.floor(diff / intervals[intervals.length - 1].bound),
    diff
  };
}