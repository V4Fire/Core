"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));

var langDict = _interopRequireWildcard(require("../../../lang"));

var _const = require("../../../core/prelude/i18n/const");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const ws = /[\r\n]+/g; // Normalize translates

Object.forEach(langDict, el => {
  if (typeof el !== 'object') {
    return el;
  }

  const map = Object.createDict();
  Object.forEach(el, (el, key) => {
    map[String(key).replace(ws, ' ')] = String(el).replace(ws, ' ');
    return map;
  });
});
/** @see [[i18n]] */

(0, _extend.default)(globalThis, 'i18n', globalI18n);
/** @see [[t]] */

(0, _extend.default)(globalThis, 't', globalI18n);
/** @see [[l]] */

(0, _extend.default)(globalThis, 'l', (strings, ...exprs) => {
  if (strings == null) {
    return '';
  }

  if (Object.isArray(strings)) {
    if (strings.length === 1) {
      return String(strings[0]);
    }

    let str = '';

    for (let i = 0; i < strings.length; i++) {
      str += String(strings[i]) + (i in exprs ? String(exprs[i]) : '');
    }

    return str;
  }

  return String(strings);
});

function globalI18n(strings, ...exprs) {
  if (strings == null) {
    return '';
  }

  if (!Object.isArray(strings)) {
    return localI18n(strings);
  }

  let str = '';

  if (exprs.length === 0) {
    for (let i = 0; i < strings.length; i++) {
      str += localI18n(strings[i]);
    }
  } else {
    for (let i = 0; i < strings.length; i++) {
      str += localI18n(strings[i]) + (i in exprs ? String(exprs[i]) : '');
    }
  }

  return str;
}

function localI18n(val, customLocale) {
  const str = String(val),
        localeName = customLocale == null ? _const.locale.value : customLocale;

  if (Object.isTruly(localeName) && localeName != null) {
    const w = langDict[localeName]?.[str];
    return w != null ? String(w) : str;
  }

  return str;
}