"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertIfDate = convertIfDate;
var _const = require("../../core/prelude/date/const");
const minDateLength = '2017-02-03'.length;
function convertIfDate(key, value) {
  if (Object.isString(value) && value.length >= minDateLength && RegExp.test(_const.isDateStr, value)) {
    const date = Date.create(value);
    return isNaN(date.valueOf()) ? value : date;
  }
  return value;
}