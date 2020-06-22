/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/number/metrics', () => {
	it('isInteger', () => {
		expect((1).isInteger()).toBeTrue();
		expect((-1).isInteger()).toBeTrue();
		expect((0).isInteger()).toBeTrue();
		expect(1.4.isInteger()).toBeFalse();
		expect(NaN.isInteger()).toBeFalse();
		expect(Infinity.isInteger()).toBeFalse();
	});

	it('Number.isInteger', () => {
		expect(Number.isInteger(1)).toBeTrue();
		expect(Number.isInteger(-1)).toBeTrue();
		expect(Number.isInteger(0)).toBeTrue();
		expect(Number.isInteger(1.4)).toBeFalse();
		expect(Number.isInteger(NaN)).toBeFalse();
		expect(Number.isInteger(Infinity)).toBeFalse();
		expect(Number.isInteger(null)).toBeFalse();
		expect(Number.isInteger('foo')).toBeFalse();
	});

	it('isFloat', () => {
		expect(1.4.isFloat()).toBeTrue();
		expect((-1.2).isFloat()).toBeTrue();
		expect((0).isFloat()).toBeFalse();
		expect(NaN.isFloat()).toBeFalse();
		expect(Infinity.isFloat()).toBeFalse();
	});

	it('Number.isFloat', () => {
		expect(Number.isFloat(1.4)).toBeTrue();
		expect(Number.isFloat(-1.2)).toBeTrue();
		expect(Number.isFloat(0)).toBeFalse();
		expect(Number.isFloat(NaN)).toBeFalse();
		expect(Number.isFloat(Infinity)).toBeFalse();
		expect(Number.isFloat(null)).toBeFalse();
		expect(Number.isFloat('foo')).toBeFalse();
	});

	it('isEven', () => {
		expect((2).isEven()).toBeTrue();
		expect((0).isEven()).toBeTrue();
		expect((3).isEven()).toBeFalse();
		expect(NaN.isEven()).toBeFalse();
		expect(Infinity.isEven()).toBeFalse();
	});

	it('Number.isEven', () => {
		expect(Number.isEven(2)).toBeTrue();
		expect(Number.isEven(0)).toBeTrue();
		expect(Number.isEven(3)).toBeFalse();
		expect(Number.isEven(NaN)).toBeFalse();
		expect(Number.isEven(Infinity)).toBeFalse();
	});

	it('isOdd', () => {
		expect((3).isOdd()).toBeTrue();
		expect((2).isOdd()).toBeFalse();
		expect((0).isOdd()).toBeFalse();
		expect(NaN.isOdd()).toBeFalse();
		expect(Infinity.isOdd()).toBeFalse();
	});

	it('Number.isOdd', () => {
		expect(Number.isOdd(1)).toBeTrue();
		expect(Number.isOdd(2)).toBeFalse();
		expect(Number.isOdd(0)).toBeFalse();
		expect(Number.isOdd(NaN)).toBeFalse();
		expect(Number.isOdd(Infinity)).toBeFalse();
	});

	it('isNatural', () => {
		expect((1).isNatural()).toBeTrue();
		expect((3).isNatural()).toBeTrue();
		expect((0).isNatural()).toBeFalse();
		expect((-1).isNatural()).toBeFalse();
		expect(1.2.isNatural()).toBeFalse();
		expect(NaN.isNatural()).toBeFalse();
		expect(Infinity.isNatural()).toBeFalse();
	});

	it('Number.isNatural', () => {
		expect(Number.isNatural(1)).toBeTrue();
		expect(Number.isNatural(3)).toBeTrue();
		expect(Number.isNatural(0)).toBeFalse();
		expect(Number.isNatural(-1)).toBeFalse();
		expect(Number.isNatural(1.2)).toBeFalse();
		expect(Number.isNatural(NaN)).toBeFalse();
		expect(Number.isNatural(Infinity)).toBeFalse();
		expect(Number.isNatural(null)).toBeFalse();
		expect(Number.isNatural('foo')).toBeFalse();
	});

	it('isPositive', () => {
		expect((1).isPositive()).toBeTrue();
		expect(1.2.isPositive()).toBeTrue();
		expect(Infinity.isPositive()).toBeTrue();
		expect(Number.NEGATIVE_INFINITY.isPositive()).toBeFalse();
		expect((-1).isPositive()).toBeFalse();
		expect((0).isPositive()).toBeFalse();
		expect(NaN.isPositive()).toBeFalse();
	});

	it('Number.isPositive', () => {
		expect(Number.isPositive(1)).toBeTrue();
		expect(Number.isPositive(1.2)).toBeTrue();
		expect(Number.isPositive(Infinity)).toBeTrue();
		expect(Number.isPositive(Number.NEGATIVE_INFINITY)).toBeFalse();
		expect(Number.isPositive(-1)).toBeFalse();
		expect(Number.isPositive(0)).toBeFalse();
		expect(Number.isPositive(NaN)).toBeFalse();
		expect(Number.isPositive(null)).toBeFalse();
		expect(Number.isPositive('foo')).toBeFalse();
	});

	it('isNegative', () => {
		expect((-1).isNegative()).toBeTrue();
		expect((-1.2).isNegative()).toBeTrue();
		expect(Number.NEGATIVE_INFINITY.isNegative()).toBeTrue();
		expect(Infinity.isNegative()).toBeFalse();
		expect((1).isNegative()).toBeFalse();
		expect((0).isNegative()).toBeFalse();
		expect(NaN.isNegative()).toBeFalse();
	});

	it('Number.isNegative', () => {
		expect(Number.isNegative(-1)).toBeTrue();
		expect(Number.isNegative(-1.2)).toBeTrue();
		expect(Number.isNegative(Number.NEGATIVE_INFINITY)).toBeTrue();
		expect(Number.isNegative(Infinity)).toBeFalse();
		expect(Number.isNegative(1)).toBeFalse();
		expect(Number.isNegative(0)).toBeFalse();
		expect(Number.isNegative(NaN)).toBeFalse();
		expect(Number.isNegative(null)).toBeFalse();
		expect(Number.isNegative('foo')).toBeFalse();
	});

	it('isNonNegative', () => {
		expect((1).isNonNegative()).toBeTrue();
		expect(1.2.isNonNegative()).toBeTrue();
		expect((0).isNonNegative()).toBeTrue();
		expect(Infinity.isNonNegative()).toBeTrue();
		expect(Number.NEGATIVE_INFINITY.isNonNegative()).toBeFalse();
		expect((-1).isNonNegative()).toBeFalse();
		expect(NaN.isNonNegative()).toBeFalse();
	});

	it('Number.isNonNegative', () => {
		expect(Number.isNonNegative(1)).toBeTrue();
		expect(Number.isNonNegative(1.2)).toBeTrue();
		expect(Number.isNonNegative(0)).toBeTrue();
		expect(Number.isNonNegative(Infinity)).toBeTrue();
		expect(Number.isNonNegative(Number.NEGATIVE_INFINITY)).toBeFalse();
		expect(Number.isNonNegative(-1)).toBeFalse();
		expect(Number.isNonNegative(NaN)).toBeFalse();
		expect(Number.isNonNegative(null)).toBeFalse();
		expect(Number.isNonNegative('foo')).toBeFalse();
	});

	it('isBetweenZeroAndOne', () => {
		expect((0).isBetweenZeroAndOne()).toBeTrue();
		expect(0.5.isBetweenZeroAndOne()).toBeTrue();
		expect((1).isBetweenZeroAndOne()).toBeTrue();
		expect((2).isBetweenZeroAndOne()).toBeFalse();
		expect((-1).isBetweenZeroAndOne()).toBeFalse();
		expect(Infinity.isBetweenZeroAndOne()).toBeFalse();
		expect(NaN.isBetweenZeroAndOne()).toBeFalse();
	});

	it('Number.isBetweenZeroAndOne', () => {
		expect(Number.isBetweenZeroAndOne(0)).toBeTrue();
		expect(Number.isBetweenZeroAndOne(0.5)).toBeTrue();
		expect(Number.isBetweenZeroAndOne(1)).toBeTrue();
		expect(Number.isBetweenZeroAndOne(2)).toBeFalse();
		expect(Number.isBetweenZeroAndOne(-1)).toBeFalse();
		expect(Number.isBetweenZeroAndOne(Infinity)).toBeFalse();
		expect(Number.isBetweenZeroAndOne(NaN)).toBeFalse();
		expect(Number.isBetweenZeroAndOne(null)).toBeFalse();
		expect(Number.isBetweenZeroAndOne('foo')).toBeFalse();
	});

	it('isPositiveBetweenZeroAndOne', () => {
		expect(0.5.isPositiveBetweenZeroAndOne()).toBeTrue();
		expect((1).isPositiveBetweenZeroAndOne()).toBeTrue();
		expect((0).isPositiveBetweenZeroAndOne()).toBeFalse();
		expect((2).isPositiveBetweenZeroAndOne()).toBeFalse();
		expect((-1).isPositiveBetweenZeroAndOne()).toBeFalse();
		expect(Infinity.isPositiveBetweenZeroAndOne()).toBeFalse();
		expect(NaN.isPositiveBetweenZeroAndOne()).toBeFalse();
	});

	it('Number.isPositiveBetweenZeroAndOne', () => {
		expect(Number.isPositiveBetweenZeroAndOne(0.5)).toBeTrue();
		expect(Number.isPositiveBetweenZeroAndOne(1)).toBeTrue();
		expect(Number.isPositiveBetweenZeroAndOne(0)).toBeFalse();
		expect(Number.isPositiveBetweenZeroAndOne(2)).toBeFalse();
		expect(Number.isPositiveBetweenZeroAndOne(-1)).toBeFalse();
		expect(Number.isPositiveBetweenZeroAndOne(Infinity)).toBeFalse();
		expect(Number.isPositiveBetweenZeroAndOne(NaN)).toBeFalse();
		expect(Number.isPositiveBetweenZeroAndOne(null)).toBeFalse();
		expect(Number.isPositiveBetweenZeroAndOne('foo')).toBeFalse();
	});
});
