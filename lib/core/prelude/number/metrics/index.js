"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @see [[Number.isSafe]] */
(0, _extend.default)(Number.prototype, 'isSafe', function isSafe() {
  return this >= Number.MIN_SAFE_INTEGER && this <= Number.MAX_SAFE_INTEGER;
});
/** @see [[NumberConstructor.isSafe]] */

(0, _extend.default)(Number, 'isSafe', value => Object.isNumber(value) && value.isSafe());
/** @see [[Number.isInteger]] */

(0, _extend.default)(Number.prototype, 'isInteger', function isInteger() {
  return this % 1 === 0;
});
/** @see [[NumberConstructor.isInteger]] */

(0, _extend.default)(Number, 'isInteger', value => Object.isNumber(value) && value.isInteger());
/** @see [[Number.isFloat]] */

(0, _extend.default)(Number.prototype, 'isFloat', function isFloat() {
  return Number.isFinite(this) && this % 1 !== 0;
});
/** @see [[NumberConstructor.isFloat]] */

(0, _extend.default)(Number, 'isFloat', value => Object.isNumber(value) && value.isFloat());
/** @see [[Number.isEven]] */

(0, _extend.default)(Number.prototype, 'isEven', function isEven() {
  return this % 2 === 0;
});
/** @see [[NumberConstructor.isEven]] */

(0, _extend.default)(Number, 'isEven', value => Object.isNumber(value) && value.isEven());
/** @see [[Number.isOdd]] */

(0, _extend.default)(Number.prototype, 'isOdd', function isOdd() {
  return Number.isFinite(this) && this % 2 !== 0;
});
/** @see [[NumberConstructor.isOdd]] */

(0, _extend.default)(Number, 'isOdd', value => Object.isNumber(value) && value.isOdd());
/** @see [[Number.isNatural]] */

(0, _extend.default)(Number.prototype, 'isNatural', function isNatural() {
  return this > 0 && this % 1 === 0;
});
/** @see [[NumberConstructor.isNatural]] */

(0, _extend.default)(Number, 'isNatural', value => Object.isNumber(value) && value.isNatural());
/** @see [[Number.isPositive]] */

(0, _extend.default)(Number.prototype, 'isPositive', function isPositive() {
  return this > 0;
});
/** @see [[NumberConstructor.isPositive]] */

(0, _extend.default)(Number, 'isPositive', value => Object.isNumber(value) && value.isPositive());
/** @see [[Number.isNegative]] */

(0, _extend.default)(Number.prototype, 'isNegative', function isNegative() {
  return this < 0;
});
/** @see [[NumberConstructor.isNegative]] */

(0, _extend.default)(Number, 'isNegative', value => Object.isNumber(value) && value.isNegative());
/** @see [[Number.isNonNegative]] */

(0, _extend.default)(Number.prototype, 'isNonNegative', function isNonNegative() {
  return this >= 0;
});
/** @see [[NumberConstructor.isNonNegative]] */

(0, _extend.default)(Number, 'isNonNegative', value => Object.isNumber(value) && value.isNonNegative());
/** @see [[Number.isBetweenZeroAndOne]] */

(0, _extend.default)(Number.prototype, 'isBetweenZeroAndOne', function isBetweenZeroAndOne() {
  return this >= 0 && this <= 1;
});
/** @see [[NumberConstructor.isBetweenZeroAndOne]] */

(0, _extend.default)(Number, 'isBetweenZeroAndOne', value => Object.isNumber(value) && value.isBetweenZeroAndOne());
/** @see [[Number.isPositiveBetweenZeroAndOne]] */

(0, _extend.default)(Number.prototype, 'isPositiveBetweenZeroAndOne', function isPositiveBetweenZeroAndOne() {
  return this > 0 && this <= 1;
});
/** @see [[NumberConstructor.isPositiveBetweenZeroAndOne]] */

(0, _extend.default)(Number, 'isPositiveBetweenZeroAndOne', value => Object.isNumber(value) && value.isPositiveBetweenZeroAndOne());