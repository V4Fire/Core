"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _const = require("../../../../core/prelude/date/const");
(0, _extend.default)(Date.prototype, 'clone', function clone() {
  return new Date(this);
});
(0, _extend.default)(Date, 'create', pattern => {
  if (pattern == null || pattern === '') {
    return new Date();
  }
  if (pattern instanceof Date) {
    return new Date(pattern);
  }
  if (Object.isString(pattern)) {
    if (pattern in _const.createAliases) {
      return _const.createAliases[pattern]();
    }
    if (!_const.isDateStr.test(pattern)) {
      return new Date(pattern);
    }
    const getZone = normalizedDate => {
      const zone = new Date(normalizedDate).getTimezoneOffset(),
        h = Math.floor(Math.abs(zone) / 60),
        m = Math.abs(zone) - h * 60;
      return `${zone <= 0 ? '+' : '-'}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    const normalizeZone = zone => {
      if (RegExp.test(_const.normalizeZoneRgxp, zone)) {
        return `${zone.substr(0, 3)}:${zone.substr(3)}`;
      }
      return zone;
    };
    const normalizeDate = date => {
      const chunks = _const.normalizeDateChunkRgxp.exec(date);
      if (chunks == null) {
        return date;
      }
      const year = chunks[1].length === 4 ? chunks[1] : chunks[3],
        day = chunks[1].length === 4 ? chunks[3] : chunks[1];
      return `${year}-${chunks[2].padStart(2, '0')}-${day.padStart(2, '0')}`;
    };
    const replacer = (str, date, time, zone) => {
      const normalizedDate = normalizeDate(date);
      time = Object.isTruly(time) ? time : '00:00:00';
      const dateTime = `${normalizedDate}T${time}`;
      zone = Object.isTruly(zone) ? zone : getZone(dateTime);
      return `${dateTime}${normalizeZone(zone)}`;
    };
    return new Date(Date.parse(pattern.replace(_const.isDateStr, replacer)));
  }
  if (Object.isString(pattern) && _const.isFloatStr.test(pattern)) {
    const float = parseFloat(pattern);
    pattern = float > 0 ? float * 1e3 : pattern;
  } else if (Object.isNumber(pattern) && !pattern.isInteger()) {
    pattern *= 1e3;
  }
  return new Date(pattern.valueOf());
});
(0, _extend.default)(Date.prototype, 'beginningOfDay', function beginningOfDay() {
  const date = this.clone();
  date.setHours(0, 0, 0, 0);
  return date;
});
(0, _extend.default)(Date, 'beginningOfDay', date => date.beginningOfDay());
(0, _extend.default)(Date.prototype, 'endOfDay', function endOfDay() {
  const date = this.clone();
  date.setHours(23, 59, 59, 999);
  return date;
});
(0, _extend.default)(Date, 'endOfDay', date => date.endOfDay());
(0, _extend.default)(Date.prototype, 'beginningOfWeek', function beginningOfWeek() {
  const date = this.clone();
  date.setDate(this.getDate() - this.getDay());
  return date.beginningOfDay();
});
(0, _extend.default)(Date, 'beginningOfWeek', date => date.beginningOfWeek());
(0, _extend.default)(Date.prototype, 'endOfWeek', function endOfWeek() {
  const date = this.clone();
  date.setDate(this.getDate() + 6 - this.getDay());
  return date.endOfDay();
});
(0, _extend.default)(Date, 'endOfWeek', date => date.endOfWeek());
(0, _extend.default)(Date.prototype, 'beginningOfMonth', function beginningOfMonth() {
  const date = this.clone();
  date.setDate(1);
  return date.beginningOfDay();
});
(0, _extend.default)(Date, 'beginningOfMonth', date => date.beginningOfMonth());
(0, _extend.default)(Date.prototype, 'endOfMonth', function endOfMonth() {
  const date = this.clone();
  date.setMonth(this.getMonth() + 1, 0);
  return date.endOfDay();
});
(0, _extend.default)(Date, 'endOfMonth', date => date.endOfMonth());
(0, _extend.default)(Date.prototype, 'daysInMonth', function daysInMonth() {
  return this.clone().endOfMonth().getDate();
});
(0, _extend.default)(Date, 'daysInMonth', date => date.daysInMonth());
(0, _extend.default)(Date.prototype, 'beginningOfYear', function beginningOfYear() {
  const date = this.clone();
  date.setMonth(0, 1);
  return date.beginningOfDay();
});
(0, _extend.default)(Date, 'beginningOfYear', date => date.beginningOfYear());
(0, _extend.default)(Date.prototype, 'endOfYear', function endOfYear() {
  const date = this.clone();
  date.setMonth(12, 0);
  return date.endOfDay();
});
(0, _extend.default)(Date, 'endOfYear', date => date.endOfYear());