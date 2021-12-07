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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Factory to create rounding methods
 * @param method
 */
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
/**
 * Factory to create static rounding methods
 * @param method
 */


function createStaticRoundingFunction(method) {
  return function wrapper(value, precision) {
    if (arguments.length < 2) {
      precision = value;
      return value => Number[Symbol.for('[[V4_EXTEND_API]]')][method](value, precision);
    }

    return value[method](precision);
  };
}
/**
 * Returns a descriptor for a getter that returns a string with attaching the specified type
 * @param type
 */


function createStringTypeGetter(type) {
  return {
    get() {
      return Number(this).toString() + type;
    }

  };
}
/**
 * Factory for functions that converts milliseconds by the specified offset
 * @param offset
 */


function createMsFunction(offset) {
  fn.valueOf = fn;
  return fn;

  function fn() {
    return Number(this) * offset;
  }
}
/**
 * Factory for static functions that converts milliseconds by the specified offset
 * @param offset
 */


function createStaticMsFunction(offset) {
  return value => value * offset;
}
/**
 * Repeats a string with the specified number of repetitions and returns a new string
 *
 * @param str
 * @param num
 */


function repeatString(str, num) {
  str = String(str);
  let res = '';

  while (num > 0) {
    // eslint-disable-next-line no-bitwise
    if ((num & 1) > 0) {
      res += str;
    } // eslint-disable-next-line no-bitwise


    num >>= 1;

    if (num > 0) {
      str += str;
    }
  }

  return res;
}