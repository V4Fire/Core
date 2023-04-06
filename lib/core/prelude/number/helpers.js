"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMsFunction = createMsFunction;
exports.createRoundingFunction = createRoundingFunction;
exports.createStaticMsFunction = createStaticMsFunction;
exports.createStaticRoundingFunction = createStaticRoundingFunction;
exports.createStringTypeGetter = createStringTypeGetter;
exports.repeatString = repeatString;
function createRoundingFunction(method) {
  return function wrapper(precision) {
    const val = Number(this);
    if (precision != null && precision > 0) {
      let multiplier = 10 ** Math.abs(precision);
      if (precision < 0) {
        multiplier = 1 / multiplier;
      }
      return method(val * multiplier) / multiplier;
    }
    return method(val);
  };
}
function createStaticRoundingFunction(method) {
  return function wrapper(value, precision) {
    if (arguments.length < 2) {
      precision = value;
      return value => Number[Symbol.for('[[V4_EXTEND_API]]')][method](value, precision);
    }
    return value[method](precision);
  };
}
function createStringTypeGetter(type) {
  return {
    get() {
      return Number(this).toString() + type;
    }
  };
}
function createMsFunction(offset) {
  fn.valueOf = fn;
  return fn;
  function fn() {
    return Number(this) * offset;
  }
}
function createStaticMsFunction(offset) {
  return value => value * offset;
}
function repeatString(str, num) {
  str = String(str);
  let res = '';
  while (num > 0) {
    if ((num & 1) > 0) {
      res += str;
    }
    num >>= 1;
    if (num > 0) {
      str += str;
    }
  }
  return res;
}