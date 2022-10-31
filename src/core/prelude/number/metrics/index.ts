/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Number.isSafe]] */
export const isSafe = extend(Number.prototype, 'isSafe', function isSafe(this: number): boolean {
	return this >= Number.MIN_SAFE_INTEGER && this <= Number.MAX_SAFE_INTEGER;
});

/** @see [[Number.isInteger]] */
export const isInteger = extend(Number.prototype, 'isInteger', function isInteger(this: number): boolean {
	return this % 1 === 0;
});

/** @see [[Number.isFloat]] */
export const isFloat = extend(Number.prototype, 'isFloat', function isFloat(this: number): boolean {
	return Number.isFinite(this) && this % 1 !== 0;
});

/** @see [[Number.isEven]] */
export const isEven = extend(Number.prototype, 'isEven', function isEven(this: number): boolean {
	return this % 2 === 0;
});

/** @see [[Number.isOdd]] */
export const isOdd = extend(Number.prototype, 'isOdd', function isOdd(this: number): boolean {
	return Number.isFinite(this) && this % 2 !== 0;
});

/** @see [[Number.isNatural]] */
export const isNatural = extend(Number.prototype, 'isNatural', function isNatural(this: number): boolean {
	return this > 0 && this % 1 === 0;
});

/** @see [[Number.isPositive]] */
export const isPositive = extend(Number.prototype, 'isPositive', function isPositive(this: number): boolean {
	return this > 0;
});

/** @see [[Number.isNegative]] */
export const isNegative = extend(Number.prototype, 'isNegative', function isNegative(this: number): boolean {
	return this < 0;
});

/** @see [[Number.isNonNegative]] */
export const isNonNegative = extend(Number.prototype, 'isNonNegative', function isNonNegative(this: number): boolean {
	return this >= 0;
});

/** @see [[Number.isBetweenZeroAndOne]] */
export const isBetweenZeroAndOne = extend(Number.prototype, 'isBetweenZeroAndOne', function isBetweenZeroAndOne(this: number): boolean {
	return this >= 0 && this <= 1;
});

/** @see [[Number.isPositiveBetweenZeroAndOne]] */
export const isPositiveBetweenZeroAndOne = extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function isPositiveBetweenZeroAndOne(this: number): boolean {
	return this > 0 && this <= 1;
});

//#if standalone/prelude
/** @see [[NumberConstructor.isPositiveBetweenZeroAndOne]] */
extend(Number, 'isPositiveBetweenZeroAndOne', (value) => Object.isNumber(value) && value.isPositiveBetweenZeroAndOne());

/** @see [[NumberConstructor.isBetweenZeroAndOne]] */
extend(Number, 'isBetweenZeroAndOne', (value) => Object.isNumber(value) && value.isBetweenZeroAndOne());

/** @see [[NumberConstructor.isNonNegative]] */
extend(Number, 'isNonNegative', (value) => Object.isNumber(value) && value.isNonNegative());

/** @see [[NumberConstructor.isNegative]] */
extend(Number, 'isNegative', (value) => Object.isNumber(value) && value.isNegative());

/** @see [[NumberConstructor.isPositive]] */
extend(Number, 'isPositive', (value) => Object.isNumber(value) && value.isPositive());

/** @see [[NumberConstructor.isNatural]] */
extend(Number, 'isNatural', (value) => Object.isNumber(value) && value.isNatural());

/** @see [[NumberConstructor.isOdd]] */
extend(Number, 'isOdd', (value) => Object.isNumber(value) && value.isOdd());

/** @see [[NumberConstructor.isEven]] */
extend(Number, 'isEven', (value) => Object.isNumber(value) && value.isEven());

/** @see [[NumberConstructor.isFloat]] */
extend(Number, 'isFloat', (value) => Object.isNumber(value) && value.isFloat());

/** @see [[NumberConstructor.isInteger]] */
extend(Number, 'isInteger', (value) => Object.isNumber(value) && value.isInteger());

/** @see [[NumberConstructor.isSafe]] */
extend(Number, 'isSafe', (value) => Object.isNumber(value) && value.isSafe());
//#endif
