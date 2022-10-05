/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see {@link Number.isSafe} */
extend(Number.prototype, 'isSafe', function isSafe(this: number): boolean {
	return this >= Number.MIN_SAFE_INTEGER && this <= Number.MAX_SAFE_INTEGER;
});

/** @see {@link NumberConstructor.isSafe} */
extend(Number, 'isSafe', (value) => Object.isNumber(value) && value.isSafe());

/** @see {@link Number.isInteger} */
extend(Number.prototype, 'isInteger', function isInteger(this: number): boolean {
	return this % 1 === 0;
});

/** @see {@link NumberConstructor.isInteger} */
extend(Number, 'isInteger', (value) => Object.isNumber(value) && value.isInteger());

/** @see {@link Number.isFloat} */
extend(Number.prototype, 'isFloat', function isFloat(this: number): boolean {
	return Number.isFinite(this) && this % 1 !== 0;
});

/** @see {@link NumberConstructor.isFloat} */
extend(Number, 'isFloat', (value) => Object.isNumber(value) && value.isFloat());

/** @see {@link Number.isEven} */
extend(Number.prototype, 'isEven', function isEven(this: number): boolean {
	return this % 2 === 0;
});

/** @see {@link NumberConstructor.isEven} */
extend(Number, 'isEven', (value) => Object.isNumber(value) && value.isEven());

/** @see {@link Number.isOdd} */
extend(Number.prototype, 'isOdd', function isOdd(this: number): boolean {
	return Number.isFinite(this) && this % 2 !== 0;
});

/** @see {@link NumberConstructor.isOdd} */
extend(Number, 'isOdd', (value) => Object.isNumber(value) && value.isOdd());

/** @see {@link Number.isNatural} */
extend(Number.prototype, 'isNatural', function isNatural(this: number): boolean {
	return this > 0 && this % 1 === 0;
});

/** @see {@link NumberConstructor.isNatural} */
extend(Number, 'isNatural', (value) => Object.isNumber(value) && value.isNatural());

/** @see {@link Number.isPositive} */
extend(Number.prototype, 'isPositive', function isPositive(this: number): boolean {
	return this > 0;
});

/** @see {@link NumberConstructor.isPositive} */
extend(Number, 'isPositive', (value) => Object.isNumber(value) && value.isPositive());

/** @see {@link Number.isNegative} */
extend(Number.prototype, 'isNegative', function isNegative(this: number): boolean {
	return this < 0;
});

/** @see {@link NumberConstructor.isNegative} */
extend(Number, 'isNegative', (value) => Object.isNumber(value) && value.isNegative());

/** @see {@link Number.isNonNegative} */
extend(Number.prototype, 'isNonNegative', function isNonNegative(this: number): boolean {
	return this >= 0;
});

/** @see {@link NumberConstructor.isNonNegative} */
extend(Number, 'isNonNegative', (value) => Object.isNumber(value) && value.isNonNegative());

/** @see {@link Number.isBetweenZeroAndOne} */
extend(Number.prototype, 'isBetweenZeroAndOne', function isBetweenZeroAndOne(this: number): boolean {
	return this >= 0 && this <= 1;
});

/** @see {@link NumberConstructor.isBetweenZeroAndOne} */
extend(Number, 'isBetweenZeroAndOne', (value) => Object.isNumber(value) && value.isBetweenZeroAndOne());

/** @see {@link Number.isPositiveBetweenZeroAndOne} */
extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function isPositiveBetweenZeroAndOne(this: number): boolean {
	return this > 0 && this <= 1;
});

/** @see {@link NumberConstructor.isPositiveBetweenZeroAndOne} */
extend(Number, 'isPositiveBetweenZeroAndOne', (value) => Object.isNumber(value) && value.isPositiveBetweenZeroAndOne());
