"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zoneChunkRgxp = exports.timeChunkRgxp = exports.normalizeZoneRgxp = exports.normalizeDateChunkRgxp = exports.isFloatStr = exports.isDateStr = exports.formatCache = exports.formatAliases = exports.defaultFormats = exports.dateChunkRgxp = exports.createAliases = exports.boolAliases = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const formatCache = Object.createDict();
exports.formatCache = formatCache;
const dateChunkRgxp = /(\d{1,4}[-./]\d{1,2}[-./]\d{1,4})/,
      timeChunkRgxp = /[T ]*(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)?(?:\d{0,3})?/,
      zoneChunkRgxp = /(Z?([+-]\d{2}:?\d{2})?)/;
exports.zoneChunkRgxp = zoneChunkRgxp;
exports.timeChunkRgxp = timeChunkRgxp;
exports.dateChunkRgxp = dateChunkRgxp;
const normalizeDateChunkRgxp = /^(\d{1,4})[-./](\d{1,2})[-./](\d{1,4})$/,
      normalizeZoneRgxp = /^[+-]\d{4}$/;
exports.normalizeZoneRgxp = normalizeZoneRgxp;
exports.normalizeDateChunkRgxp = normalizeDateChunkRgxp;
const isDateStr = new RegExp(`^${dateChunkRgxp.source}${timeChunkRgxp.source}${zoneChunkRgxp.source}$`),
      isFloatStr = /^\d+\.\d+$/;
exports.isFloatStr = isFloatStr;
exports.isDateStr = isDateStr;
const createAliases = Object.createDict({
  now: () => new Date(),
  today: () => new Date().beginningOfDay(),
  yesterday: () => {
    const v = new Date();
    v.setDate(v.getDate() - 1);
    return v.beginningOfDay();
  },
  tomorrow: () => {
    const v = new Date();
    v.setDate(v.getDate() + 1);
    return v.beginningOfDay();
  }
});
exports.createAliases = createAliases;
const formatAliases = Object.createDict({
  e: 'era',
  Y: 'year',
  M: 'month',
  d: 'day',
  w: 'weekday',
  h: 'hour',
  m: 'minute',
  s: 'second',
  z: 'timeZoneName'
});
exports.formatAliases = formatAliases;
Object.forEach(formatAliases, val => {
  formatAliases[val] = val;
});
['Y', 'M', 'w', 'd', 'h', 'm', 's'].forEach(key => {
  const format = date => {
    const now = new Date();

    if (date.format(key) !== now.format(key)) {
      return formatAliases[key];
    }
  };

  formatAliases[`${key}?`] = format;
  formatAliases[`${formatAliases[key]}?`] = format;
});
const boolAliases = Object.createDict({
  '+': true,
  '-': false
});
exports.boolAliases = boolAliases;
const defaultFormats = Object.createDict({
  era: 'short',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
});
exports.defaultFormats = defaultFormats;