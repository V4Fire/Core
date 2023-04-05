"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValueCanBeArrayIndex = isValueCanBeArrayIndex;
function isValueCanBeArrayIndex(value) {
  if (Object.isString(value) && String(Number(value)) === value) {
    value = Number(value);
  }
  if (Object.isNumber(value)) {
    const maxArrayIndex = 2 ** 32 - 1;
    return Number.isInteger(value) && Number.isNonNegative(value) && value <= maxArrayIndex;
  }
  return false;
}