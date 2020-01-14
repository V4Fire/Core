/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:binary-expression-operand-order
// tslint:disable:no-bitwise

import extend from 'core/prelude/extend';

/** @see Number.prototype.isInteger */
extend(Number.prototype, 'isInteger', function (): boolean {
	return this % 1 === 0;
});

/** @see NumberConstructor.isInteger */
extend(Number, 'isInteger', (obj) => Object.isNumber(obj) && obj.isInteger());

/** @see Number.prototype.isFloat */
extend(Number.prototype, 'isFloat', function (): boolean {
	return this % 1 !== 0 && Number.isFinite(this);
});

/** @see NumberConstructor.isFloat */
extend(Number, 'isFloat', (obj) => Object.isNumber(obj) && obj.isFloat());

/** @see Number.prototype.isEven */
extend(Number.prototype, 'isEven', function (): boolean {
	return this % 2 === 0;
});

/** @see NumberConstructor.isEven */
extend(Number, 'isEven', (obj) => Object.isNumber(obj) && obj.isEven());

/** @see Number.prototype.isOdd */
extend(Number.prototype, 'isOdd', function (): boolean {
	return this % 2 !== 0 && Number.isFinite(this);
});

/** @see NumberConstructor.isOdd */
extend(Number, 'isOdd', (obj) => Object.isNumber(obj) && obj.isOdd());

/** @see Number.prototype.isNatural */
extend(Number.prototype, 'isNatural', function (): boolean {
	return this > 0 && this % 1 === 0;
});

/** @see NumberConstructor.isNatural */
extend(Number, 'isNatural', (obj) => Object.isNumber(obj) && obj.isNatural());

/** @see Number.prototype.isPositive */
extend(Number.prototype, 'isPositive', function (): boolean {
	return this > 0;
});

/** @see NumberConstructor.isPositive */
extend(Number, 'isPositive', (obj) => Object.isNumber(obj) && obj.isPositive());

/** @see Number.prototype.isNegative */
extend(Number.prototype, 'isNegative', function (): boolean {
	return this < 0;
});

/** @see NumberConstructor.isNegative */
extend(Number, 'isNegative', (obj) => Object.isNumber(obj) && obj.isNegative());

/** @see Number.prototype.isNonNegative */
extend(Number.prototype, 'isNonNegative', function (): boolean {
	return this >= 0;
});

/** @see NumberConstructor.isNonNegative */
extend(Number, 'isNonNegative', (obj) => Object.isNumber(obj) && obj.isNonNegative());

/** @see Number.prototype.isBetweenZeroAndOne */
extend(Number.prototype, 'isBetweenZeroAndOne', function (): boolean {
	return this >= 0 && this <= 1;
});

/** @see NumberConstructor.isBetweenZeroAndOne */
extend(Number, 'isBetweenZeroAndOne', (obj) => Object.isNumber(obj) && obj.isBetweenZeroAndOne());

/** @see Number.prototype.isPositiveBetweenZeroAndOne */
extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function (): boolean {
	return this > 0 && this <= 1;
});

/** @see NumberConstructor.isPositiveBetweenZeroAndOne */
extend(Number, 'isPositiveBetweenZeroAndOne', (obj) => Object.isNumber(obj) && obj.isPositiveBetweenZeroAndOne());
