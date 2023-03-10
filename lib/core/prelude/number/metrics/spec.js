"use strict";

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/number/metrics', () => {
  it('`isInteger`', () => {
    expect(1 .isInteger()).toBe(true);
    expect((-1).isInteger()).toBe(true);
    expect(0 .isInteger()).toBe(true);
    expect(1.4.isInteger()).toBe(false);
    expect(NaN.isInteger()).toBe(false);
    expect(Infinity.isInteger()).toBe(false);
  });
  it('`Number.isInteger`', () => {
    expect(Number.isInteger(1)).toBe(true);
    expect(Number.isInteger(-1)).toBe(true);
    expect(Number.isInteger(0)).toBe(true);
    expect(Number.isInteger(1.4)).toBe(false);
    expect(Number.isInteger(NaN)).toBe(false);
    expect(Number.isInteger(Infinity)).toBe(false);
    expect(Number.isInteger(null)).toBe(false);
    expect(Number.isInteger('foo')).toBe(false);
  });
  it('`isFloat`', () => {
    expect(1.4.isFloat()).toBe(true);
    expect((-1.2).isFloat()).toBe(true);
    expect(0 .isFloat()).toBe(false);
    expect(NaN.isFloat()).toBe(false);
    expect(Infinity.isFloat()).toBe(false);
  });
  it('`Number.isFloat`', () => {
    expect(Number.isFloat(1.4)).toBe(true);
    expect(Number.isFloat(-1.2)).toBe(true);
    expect(Number.isFloat(0)).toBe(false);
    expect(Number.isFloat(NaN)).toBe(false);
    expect(Number.isFloat(Infinity)).toBe(false);
    expect(Number.isFloat(null)).toBe(false);
    expect(Number.isFloat('foo')).toBe(false);
  });
  it('`isEven`', () => {
    expect(2 .isEven()).toBe(true);
    expect(0 .isEven()).toBe(true);
    expect(3 .isEven()).toBe(false);
    expect(NaN.isEven()).toBe(false);
    expect(Infinity.isEven()).toBe(false);
  });
  it('`Number.isEven`', () => {
    expect(Number.isEven(2)).toBe(true);
    expect(Number.isEven(0)).toBe(true);
    expect(Number.isEven(3)).toBe(false);
    expect(Number.isEven(NaN)).toBe(false);
    expect(Number.isEven(Infinity)).toBe(false);
  });
  it('`isOdd`', () => {
    expect(3 .isOdd()).toBe(true);
    expect(2 .isOdd()).toBe(false);
    expect(0 .isOdd()).toBe(false);
    expect(NaN.isOdd()).toBe(false);
    expect(Infinity.isOdd()).toBe(false);
  });
  it('`Number.isOdd`', () => {
    expect(Number.isOdd(1)).toBe(true);
    expect(Number.isOdd(2)).toBe(false);
    expect(Number.isOdd(0)).toBe(false);
    expect(Number.isOdd(NaN)).toBe(false);
    expect(Number.isOdd(Infinity)).toBe(false);
  });
  it('`isNatural`', () => {
    expect(1 .isNatural()).toBe(true);
    expect(3 .isNatural()).toBe(true);
    expect(0 .isNatural()).toBe(false);
    expect((-1).isNatural()).toBe(false);
    expect(1.2.isNatural()).toBe(false);
    expect(NaN.isNatural()).toBe(false);
    expect(Infinity.isNatural()).toBe(false);
  });
  it('`Number.isNatural`', () => {
    expect(Number.isNatural(1)).toBe(true);
    expect(Number.isNatural(3)).toBe(true);
    expect(Number.isNatural(0)).toBe(false);
    expect(Number.isNatural(-1)).toBe(false);
    expect(Number.isNatural(1.2)).toBe(false);
    expect(Number.isNatural(NaN)).toBe(false);
    expect(Number.isNatural(Infinity)).toBe(false);
    expect(Number.isNatural(null)).toBe(false);
    expect(Number.isNatural('foo')).toBe(false);
  });
  it('`isPositive`', () => {
    expect(1 .isPositive()).toBe(true);
    expect(1.2.isPositive()).toBe(true);
    expect(Infinity.isPositive()).toBe(true);
    expect(Number.NEGATIVE_INFINITY.isPositive()).toBe(false);
    expect((-1).isPositive()).toBe(false);
    expect(0 .isPositive()).toBe(false);
    expect(NaN.isPositive()).toBe(false);
  });
  it('`Number.isPositive`', () => {
    expect(Number.isPositive(1)).toBe(true);
    expect(Number.isPositive(1.2)).toBe(true);
    expect(Number.isPositive(Infinity)).toBe(true);
    expect(Number.isPositive(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(Number.isPositive(-1)).toBe(false);
    expect(Number.isPositive(0)).toBe(false);
    expect(Number.isPositive(NaN)).toBe(false);
    expect(Number.isPositive(null)).toBe(false);
    expect(Number.isPositive('foo')).toBe(false);
  });
  it('`isNegative`', () => {
    expect((-1).isNegative()).toBe(true);
    expect((-1.2).isNegative()).toBe(true);
    expect(Number.NEGATIVE_INFINITY.isNegative()).toBe(true);
    expect(Infinity.isNegative()).toBe(false);
    expect(1 .isNegative()).toBe(false);
    expect(0 .isNegative()).toBe(false);
    expect(NaN.isNegative()).toBe(false);
  });
  it('`Number.isNegative`', () => {
    expect(Number.isNegative(-1)).toBe(true);
    expect(Number.isNegative(-1.2)).toBe(true);
    expect(Number.isNegative(Number.NEGATIVE_INFINITY)).toBe(true);
    expect(Number.isNegative(Infinity)).toBe(false);
    expect(Number.isNegative(1)).toBe(false);
    expect(Number.isNegative(0)).toBe(false);
    expect(Number.isNegative(NaN)).toBe(false);
    expect(Number.isNegative(null)).toBe(false);
    expect(Number.isNegative('foo')).toBe(false);
  });
  it('`isNonNegative`', () => {
    expect(1 .isNonNegative()).toBe(true);
    expect(1.2.isNonNegative()).toBe(true);
    expect(0 .isNonNegative()).toBe(true);
    expect(Infinity.isNonNegative()).toBe(true);
    expect(Number.NEGATIVE_INFINITY.isNonNegative()).toBe(false);
    expect((-1).isNonNegative()).toBe(false);
    expect(NaN.isNonNegative()).toBe(false);
  });
  it('`Number.isNonNegative`', () => {
    expect(Number.isNonNegative(1)).toBe(true);
    expect(Number.isNonNegative(1.2)).toBe(true);
    expect(Number.isNonNegative(0)).toBe(true);
    expect(Number.isNonNegative(Infinity)).toBe(true);
    expect(Number.isNonNegative(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(Number.isNonNegative(-1)).toBe(false);
    expect(Number.isNonNegative(NaN)).toBe(false);
    expect(Number.isNonNegative(null)).toBe(false);
    expect(Number.isNonNegative('foo')).toBe(false);
  });
  it('`isBetweenZeroAndOne`', () => {
    expect(0 .isBetweenZeroAndOne()).toBe(true);
    expect(0.5.isBetweenZeroAndOne()).toBe(true);
    expect(1 .isBetweenZeroAndOne()).toBe(true);
    expect(2 .isBetweenZeroAndOne()).toBe(false);
    expect((-1).isBetweenZeroAndOne()).toBe(false);
    expect(Infinity.isBetweenZeroAndOne()).toBe(false);
    expect(NaN.isBetweenZeroAndOne()).toBe(false);
  });
  it('`Number.isBetweenZeroAndOne`', () => {
    expect(Number.isBetweenZeroAndOne(0)).toBe(true);
    expect(Number.isBetweenZeroAndOne(0.5)).toBe(true);
    expect(Number.isBetweenZeroAndOne(1)).toBe(true);
    expect(Number.isBetweenZeroAndOne(2)).toBe(false);
    expect(Number.isBetweenZeroAndOne(-1)).toBe(false);
    expect(Number.isBetweenZeroAndOne(Infinity)).toBe(false);
    expect(Number.isBetweenZeroAndOne(NaN)).toBe(false);
    expect(Number.isBetweenZeroAndOne(null)).toBe(false);
    expect(Number.isBetweenZeroAndOne('foo')).toBe(false);
  });
  it('`isPositiveBetweenZeroAndOne`', () => {
    expect(0.5.isPositiveBetweenZeroAndOne()).toBe(true);
    expect(1 .isPositiveBetweenZeroAndOne()).toBe(true);
    expect(0 .isPositiveBetweenZeroAndOne()).toBe(false);
    expect(2 .isPositiveBetweenZeroAndOne()).toBe(false);
    expect((-1).isPositiveBetweenZeroAndOne()).toBe(false);
    expect(Infinity.isPositiveBetweenZeroAndOne()).toBe(false);
    expect(NaN.isPositiveBetweenZeroAndOne()).toBe(false);
  });
  it('`Number.isPositiveBetweenZeroAndOne`', () => {
    expect(Number.isPositiveBetweenZeroAndOne(0.5)).toBe(true);
    expect(Number.isPositiveBetweenZeroAndOne(1)).toBe(true);
    expect(Number.isPositiveBetweenZeroAndOne(0)).toBe(false);
    expect(Number.isPositiveBetweenZeroAndOne(2)).toBe(false);
    expect(Number.isPositiveBetweenZeroAndOne(-1)).toBe(false);
    expect(Number.isPositiveBetweenZeroAndOne(Infinity)).toBe(false);
    expect(Number.isPositiveBetweenZeroAndOne(NaN)).toBe(false);
    expect(Number.isPositiveBetweenZeroAndOne(null)).toBe(false);
    expect(Number.isPositiveBetweenZeroAndOne('foo')).toBe(false);
  });
});