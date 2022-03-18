"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyQueryForStr = applyQueryForStr;

var _const = require("../../../core/request/helpers/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Applies a query object for the specified string
 * (used keys are removed from the query)
 *
 * @param str
 * @param [query]
 * @param [rgxp] - template regexp
 */
function applyQueryForStr(str, query, rgxp = _const.tplRgxp) {
  if (!query) {
    return str;
  }

  return str.replace(rgxp, (str, param, adv = '') => {
    const value = query[param],
          desc = Object.getOwnPropertyDescriptor(query, param);

    if (value != null && desc != null) {
      if (desc.configurable === true && desc.enumerable === true) {
        Object.defineProperty(query, param, {
          value,
          enumerable: false,
          configurable: true,
          writable: desc.writable ?? true
        });
      }

      return (str.startsWith('/') ? '/' : '') + String(value) + String(Object.isNumber(adv) ? '' : adv);
    }

    return '';
  });
}