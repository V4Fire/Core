"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalFormatOpts = exports.formatCache = exports.formatAliases = exports.defaultFormats = exports.decPartRgxp = exports.boolAliases = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const formatCache = Object.createDict();
exports.formatCache = formatCache;
const decPartRgxp = /\.\d+/;
exports.decPartRgxp = decPartRgxp;
const globalFormatOpts = Object.createDict({
  init: false,
  decimal: '.',
  thousands: ','
});
exports.globalFormatOpts = globalFormatOpts;
const formatAliases = Object.createDict({
  $: 'currency',
  $d: 'currencyDisplay',
  '%': 'percent',
  '.': 'decimal'
});
exports.formatAliases = formatAliases;
const boolAliases = Object.createDict({
  '+': true,
  '-': false
});
exports.boolAliases = boolAliases;
const defaultFormats = Object.createDict({
  style: 'decimal',
  currency: 'USD',
  currencyDisplay: 'symbol'
});
exports.defaultFormats = defaultFormats;