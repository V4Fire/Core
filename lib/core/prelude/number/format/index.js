"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

var _functools = require("../../../../core/functools");

var _i18n = require("../../../../core/prelude/i18n");

var _const = require("../../../../core/prelude/number/const");

var _helpers = require("../../../../core/prelude/number/helpers");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[Number.pad]] */
(0, _extend.default)(Number.prototype, 'pad', function pad(lengthOrOpts = 0, opts) {
  opts = { ...(Object.isPlainObject(lengthOrOpts) ? lengthOrOpts : opts)
  };

  if (opts.length == null) {
    opts.length = Object.isNumber(lengthOrOpts) ? lengthOrOpts : 0;
  }

  const val = Number(this);
  let str = Math.abs(val).toString(opts.base ?? 10);
  str = (0, _helpers.repeatString)('0', opts.length - str.replace(_const.decPartRgxp, '').length) + str;

  if (opts.sign || val < 0) {
    str = (val < 0 ? '-' : '+') + str;
  }

  return str;
});
/** @see [[NumberConstructor.pad]] */

(0, _extend.default)(Number, 'pad', (value, lengthOrOpts) => {
  if (Object.isPlainObject(value)) {
    const opts = value;
    return value => Number.pad(value, opts);
  }

  return value.pad(Object.cast(lengthOrOpts));
});
/** @see [[Number.format]] */

(0, _extend.default)(Number.prototype, 'format', function format(patternOrOpts, locale = _i18n.locale.value) {
  if (patternOrOpts === undefined && !_const.globalFormatOpts.init) {
    return this.toLocaleString(locale);
  }

  if (Object.isPlainObject(patternOrOpts)) {
    return this.toLocaleString(locale, patternOrOpts);
  }

  if (Object.isString(patternOrOpts)) {
    const pattern = patternOrOpts,
          cacheKey = [locale, pattern].join();
    let formatter = _const.formatCache[cacheKey];

    if (formatter == null) {
      const chunks = pattern.split(';'),
            opts = {};

      for (let i = 0; i < chunks.length; i++) {
        const formatChunk = chunks[i].trim();
        let [formatKey, formatParams = null] = formatChunk.split(':');
        formatKey = formatKey.trim();

        if (formatParams != null) {
          formatParams = formatParams.trim();
        }

        const alias = _const.formatAliases[formatKey];

        if (alias != null) {
          formatKey = alias;

          switch (alias) {
            case 'currency':
              opts.style = 'currency';
              opts.currency = formatParams ?? _const.defaultFormats.currency;
              break;

            case 'currencyDisplay':
              opts.currencyDisplay = formatParams ?? _const.defaultFormats.currencyDisplay;
              break;

            case 'percent':
              opts.style = 'percent';
              break;

            case 'decimal':
              opts.style = 'decimal';
              break;

            default:
              throw new TypeError(`Unknown alias "${alias}"`);
          }
        } else {
          if (formatParams == null || formatParams === '') {
            formatParams = _const.defaultFormats[formatKey];
          }

          if (formatParams != null) {
            opts[formatKey] = formatParams in _const.boolAliases ? _const.boolAliases[formatParams] : formatParams;
          }
        }
      }

      formatter = new Intl.NumberFormat(locale, opts);
      _const.formatCache[cacheKey] = formatter;
    }

    return formatter.format(this);
  }

  const decimalLength = Number(patternOrOpts);
  const val = Number(this),
        str = patternOrOpts != null ? val.toFixed(decimalLength) : val.toString();
  const [int, dec = ''] = str.split('.');
  let res = '';

  for (let i = int.length - 1, j = 0; i >= 0; i--) {
    if (j === 3) {
      j = 0;
      res = _const.globalFormatOpts.thousands + res;
    }

    j++;
    res = int[i] + res;
  }

  if (dec.length > 0) {
    return res + _const.globalFormatOpts.decimal + dec;
  }

  return res;
});
/** @see [[NumberConstructor.format]] */

(0, _extend.default)(Number, 'format', (value, patternOrOpts, locale) => {
  if (Object.isString(value) || Object.isPlainObject(value)) {
    locale = Object.cast(patternOrOpts);
    patternOrOpts = value;
    return value => Number.format(value, Object.cast(patternOrOpts), locale);
  }

  return value.format(Object.cast(patternOrOpts), locale);
});
/** @see [[NumberConstructor.getOption]] */

(0, _extend.default)(Number, 'getOption', (0, _functools.deprecate)(function getOption(key) {
  return _const.globalFormatOpts[key];
}));
/** @see [[NumberConstructor.setOption]] */

(0, _extend.default)(Number, 'setOption', (0, _functools.deprecate)(function setOption(key, value) {
  _const.globalFormatOpts.init = true;
  _const.globalFormatOpts[key] = value;
}));