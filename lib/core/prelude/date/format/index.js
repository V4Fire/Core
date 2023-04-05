"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
var _i18n = require("../../../../core/prelude/i18n");
var _const = require("../../../../core/prelude/date/const");
var _helpers = require("../../../../core/prelude/date/helpers");
(0, _extend.default)(Date.prototype, 'short', function short(locale = _i18n.locale.value) {
  return this.format('d:numeric;M:numeric;Y:numeric', locale);
});
(0, _extend.default)(Date, 'short', (0, _helpers.createStaticDateFormatter)('short'));
(0, _extend.default)(Date.prototype, 'medium', function medium(locale = _i18n.locale.value) {
  return this.format('d:numeric;M:long;Y:numeric', locale);
});
(0, _extend.default)(Date, 'medium', (0, _helpers.createStaticDateFormatter)('medium'));
(0, _extend.default)(Date.prototype, 'long', function long(locale = _i18n.locale.value) {
  return this.format('d:numeric;M:long;Y:numeric;h:2-digit;m:2-digit;s:2-digit', locale);
});
(0, _extend.default)(Date, 'long', (0, _helpers.createStaticDateFormatter)('long'));
(0, _extend.default)(Date.prototype, 'format', function format(patternOrOpts, locale = _i18n.locale.value) {
  if (Object.isPlainObject(patternOrOpts)) {
    return this.toLocaleString(locale, patternOrOpts);
  }
  const pattern = String(patternOrOpts);
  const canCache = !pattern.includes('?'),
    cacheKey = [locale, pattern].join();
  let formatter = canCache ? _const.formatCache[cacheKey] : null;
  if (formatter == null) {
    const chunks = pattern.split(';'),
      opts = {};
    for (let i = 0; i < chunks.length; i++) {
      const formatChunk = chunks[i].trim();
      let [formatKey, formatParams = ''] = formatChunk.split(':');
      formatKey = formatKey.trim();
      if (formatParams !== '') {
        formatParams = formatParams.trim();
      }
      const formatKeyAlias = _const.formatAliases[formatKey];
      if (formatKeyAlias != null) {
        formatKey = formatKeyAlias;
        if (Object.isFunction(formatKey)) {
          formatKey = formatKey(this);
          if (formatKey == null) {
            continue;
          }
        }
      }
      if (formatParams === '') {
        formatParams = _const.defaultFormats[formatKey];
      }
      opts[formatKey] = formatParams in _const.boolAliases ? _const.boolAliases[formatParams] : formatParams;
    }
    formatter = new Intl.DateTimeFormat(locale, opts);
    if (canCache) {
      _const.formatCache[cacheKey] = formatter;
    }
  }
  return formatter.format(this);
});
(0, _extend.default)(Date, 'format', (date, patternOrOpts, locale) => {
  if (Object.isString(date) || Object.isPlainObject(date)) {
    locale = Object.cast(patternOrOpts);
    patternOrOpts = date;
    return date => Date.format(date, Object.cast(patternOrOpts), locale);
  }
  return date.format(Object.cast(patternOrOpts), locale);
});
(0, _extend.default)(Date.prototype, 'toHTMLDateString', function toHTMLDateString(opts = {}) {
  const s = v => String(v).padStart(2, '0'),
    needMonth = opts.month !== false;
  return [this.getFullYear(), needMonth ? s(this.getMonth() + 1) : '01', needMonth && opts.date !== false ? s(this.getDate()) : '01'].join('-');
});
(0, _extend.default)(Date, 'toHTMLDateString', (0, _helpers.createStaticDateFormatter)('toHTMLDateString'));
(0, _extend.default)(Date.prototype, 'toHTMLTimeString', function toHTMLTimeString(opts = {}) {
  const s = v => String(v).padStart(2, '0'),
    needMinutes = opts.minutes !== false;
  const res = [s(this.getHours()), needMinutes ? s(this.getMinutes()) : '00'];
  if (needMinutes && opts.seconds !== false) {
    const sec = s(this.getSeconds());
    if (opts.milliseconds !== false) {
      res.push(`${sec}.${this.getMilliseconds()}`);
    } else {
      res.push(sec);
    }
  }
  return res.join(':');
});
(0, _extend.default)(Date, 'toHTMLTimeString', (0, _helpers.createStaticDateFormatter)('toHTMLTimeString'));
(0, _extend.default)(Date.prototype, 'toHTMLString', function toHTMLString(opts) {
  return `${this.toHTMLDateString(opts)}T${this.toHTMLTimeString(opts)}`;
});
(0, _extend.default)(Date, 'toHTMLString', (0, _helpers.createStaticDateFormatter)('toHTMLString'));