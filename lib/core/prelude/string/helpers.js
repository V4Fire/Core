"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToSeparatedStr = convertToSeparatedStr;
exports.createStaticTransformFunction = createStaticTransformFunction;
exports.isCharUpper = isCharUpper;
exports.toCamelize = toCamelize;
exports.toDasherize = toDasherize;
exports.toUnderscore = toUnderscore;
function isCharUpper(char) {
  const up = char.toUpperCase();
  return char === up && char.toLowerCase() !== up;
}
function toUnderscore(str, start, end, middle) {
  if (middle != null) {
    return '_';
  }
  return new Array((start ?? end ?? '').length + 1).join('_');
}
function toCamelize(str, start, end, middle) {
  if (middle != null) {
    return middle.toUpperCase();
  }
  return start ?? end ?? '';
}
function toDasherize(str, start, end, middle) {
  if (middle != null) {
    return '-';
  }
  return new Array((start ?? end ?? '').length + 1).join('-');
}
function convertToSeparatedStr(str, separator, stable) {
  const symbols = [...str.letters()];
  let res = '';
  for (let i = 0; i < symbols.length; i++) {
    const el = symbols[i];
    if (el === separator) {
      res += separator;
      continue;
    }
    if (res.endsWith(separator)) {
      res += el.toLowerCase();
      continue;
    }
    const nextChar = symbols[i + 1];
    if (isCharUpper(el)) {
      const needSeparator = i > 0 && (stable || Object.isTruly(nextChar) && nextChar !== separator && !isCharUpper(nextChar));
      if (needSeparator) {
        res += separator;
      }
      res += el.toLowerCase();
    } else {
      res += el;
      if (Object.isTruly(nextChar) && isCharUpper(nextChar)) {
        res += separator;
      }
    }
  }
  return res;
}
function createStaticTransformFunction(method) {
  return (value, opts) => {
    if (Object.isBoolean(value) || Object.isDictionary(value)) {
      opts = value;
      return value => String[method](value, opts);
    }
    return value[method](opts);
  };
}