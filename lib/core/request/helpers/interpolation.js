"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyQueryForStr = applyQueryForStr;
var _const = require("../../../core/request/helpers/const");
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