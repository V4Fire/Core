/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Number.isInteger */
extend(Number.prototype, 'isInteger', function (): boolean {
	return this % 1 === 0;
});

/** @see NumberConstructor.isInteger */
extend(Number, 'isInteger', (value) => Object.isNumber(value) && value.isInteger());

/** @see Number.isFloat */
extend(Number.prototype, 'isFloat', function (): boolean {
	return this % 1 !== 0 && Number.isFinite(this);
});

/** @see NumberConstructor.isFloat */
extend(Number, 'isFloat', (value) => Object.isNumber(value) && value.isFloat());

/** @see Number.isEven */
extend(Number.prototype, 'isEven', function (): boolean {
	return this % 2 === 0;
});

/** @see NumberConstructor.isEven */
extend(Number, 'isEven', (value) => Object.isNumber(value) && value.isEven());

/** @see Number.isOdd */
extend(Number.prototype, 'isOdd', function (): boolean {
	return this % 2 !== 0 && Number.isFinite(this);
});

/** @see NumberConstructor.isOdd */
extend(Number, 'isOdd', (value) => Object.isNumber(value) && value.isOdd());

/** @see Number.isNatural */
extend(Number.prototype, 'isNatural', function (): boolean {
	return this > 0 && this % 1 === 0;
});

/** @see NumberConstructor.isNatural */
extend(Number, 'isNatural', (value) => Object.isNumber(value) && value.isNatural());

/** @see Number.isPositive */
extend(Number.prototype, 'isPositive', function (): boolean {
	return this > 0;
});

/** @see NumberConstructor.isPositive */
extend(Number, 'isPositive', (value) => Object.isNumber(value) && value.isPositive());

/** @see Number.isNegative */
extend(Number.prototype, 'isNegative', function (): boolean {
	return this < 0;
});

/** @see NumberConstructor.isNegative */
extend(Number, 'isNegative', (value) => Object.isNumber(value) && value.isNegative());

/** @see Number.isNonNegative */
extend(Number.prototype, 'isNonNegative', function (): boolean {
	return this >= 0;
});

/** @see NumberConstructor.isNonNegative */
extend(Number, 'isNonNegative', (value) => Object.isNumber(value) && value.isNonNegative());

/** @see Number.isBetweenZeroAndOne */
extend(Number.prototype, 'isBetweenZeroAndOne', function (): boolean {
	return this >= 0 && this <= 1;
});

/** @see NumberConstructor.isBetweenZeroAndOne */
extend(Number, 'isBetweenZeroAndOne', (value) => Object.isNumber(value) && value.isBetweenZeroAndOne());

/** @see Number.isPositiveBetweenZeroAndOne */
extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function (): boolean {
	return this > 0 && this <= 1;
});

/** @see NumberConstructor.isPositiveBetweenZeroAndOne */
extend(Number, 'isPositiveBetweenZeroAndOne', (value) => Object.isNumber(value) && value.isPositiveBetweenZeroAndOne());
