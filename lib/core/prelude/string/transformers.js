"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
var _const = require("../../../core/prelude/string/const");
var _helpers = require("../../../core/prelude/string/helpers");
(0, _extend.default)(String.prototype, 'capitalize', function capitalize({
  lower,
  all,
  cache
} = {}) {
  const str = this.toString(),
    cacheKey = cache !== false ? `${Boolean(lower)}:${Boolean(all)}:${str}` : null,
    valFromCache = cacheKey != null ? _const.capitalizeCache[cacheKey] : null;
  if (valFromCache != null) {
    return valFromCache;
  }
  let res;
  if (all) {
    const chunks = str.split(' ');
    for (let i = 0; i < chunks.length; i++) {
      chunks[i] = chunks[i].capitalize({
        lower
      });
    }
    res = chunks.join(' ');
  } else {
    res = lower ? str.toLowerCase() : str;
    res = res[0].toUpperCase() + res.slice(1);
  }
  if (cacheKey != null) {
    _const.capitalizeCache[cacheKey] = res;
  }
  return res;
});
(0, _extend.default)(String, 'capitalize', (0, _helpers.createStaticTransformFunction)('capitalize'));
(0, _extend.default)(String.prototype, 'camelize', function camelize(upperOrOpts) {
  const opts = {};
  if (Object.isBoolean(upperOrOpts)) {
    opts.upper = upperOrOpts;
  } else {
    Object.assign(opts, upperOrOpts);
  }
  opts.upper = opts.upper !== false;
  const str = this.toString(),
    cacheKey = opts.cache !== false ? `${opts.upper}:${str}` : null,
    valFromCache = cacheKey != null ? _const.camelizeCache[cacheKey] : null;
  if (valFromCache != null) {
    return valFromCache;
  }
  let res = str.trim().replace(_const.camelizeRgxp, _helpers.toCamelize);
  if (res.length > 0) {
    res = (opts.upper ? res[0].toUpperCase() : res[0].toLowerCase()) + res.slice(1);
  }
  if (cacheKey != null) {
    _const.camelizeCache[cacheKey] = res;
  }
  return res;
});
(0, _extend.default)(String, 'camelize', (0, _helpers.createStaticTransformFunction)('camelize'));
(0, _extend.default)(String.prototype, 'dasherize', function dasherize(stableOrOpts) {
  const opts = {};
  if (Object.isBoolean(stableOrOpts)) {
    opts.stable = stableOrOpts;
  } else {
    Object.assign(opts, stableOrOpts);
  }
  opts.stable = opts.stable === true;
  const str = this.toString(),
    cacheKey = opts.cache !== false ? `${opts.stable}:${str}` : null,
    valFromCache = cacheKey != null ? _const.dasherizeCache[cacheKey] : null;
  if (valFromCache != null) {
    return valFromCache;
  }
  const res = (0, _helpers.convertToSeparatedStr)(str.trim().replace(_const.normalizeRgxp, _helpers.toDasherize), '-', opts.stable);
  if (cacheKey != null) {
    _const.dasherizeCache[cacheKey] = res;
  }
  return res;
});
(0, _extend.default)(String, 'dasherize', (0, _helpers.createStaticTransformFunction)('dasherize'));
(0, _extend.default)(String.prototype, 'underscore', function underscore(stableOrOpts) {
  const opts = {};
  if (Object.isBoolean(stableOrOpts)) {
    opts.stable = stableOrOpts;
  } else {
    Object.assign(opts, stableOrOpts);
  }
  opts.stable = opts.stable === true;
  const str = this.toString(),
    cacheKey = opts.cache !== false ? `${opts.stable}:${str}` : null,
    valFromCache = cacheKey != null ? _const.underscoreCache[cacheKey] : null;
  if (valFromCache != null) {
    return valFromCache;
  }
  const res = (0, _helpers.convertToSeparatedStr)(str.trim().replace(_const.normalizeRgxp, _helpers.toUnderscore), '_', opts.stable);
  if (cacheKey != null) {
    _const.underscoreCache[cacheKey] = res;
  }
  return res;
});
(0, _extend.default)(String, 'underscore', (0, _helpers.createStaticTransformFunction)('underscore'));