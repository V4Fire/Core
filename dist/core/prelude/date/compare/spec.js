"use strict";

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/date/compare', () => {
  const past = new Date(2015, 10, 12),
        now = new Date(),
        future = new Date(2450, 10, 3);
  it('`is`', () => {
    expect(now.is(now.valueOf())).toBeTrue();
    expect(now.is(new Date(now.valueOf() - 100), 100)).toBeTrue();
    expect(now.is('tomorrow')).toBeFalse();
  });
  it('`Date.is`', () => {
    expect(Date.is(100, now)(new Date(now.valueOf() - 100))).toBeTrue();
    expect(Date.is(now)(now.valueOf())).toBeTrue();
    expect(Date.is('today', 'tomorrow')).toBeFalse();
  });
  it('`isPast`', () => {
    expect(past.isPast()).toBeTrue();
    expect(future.isPast()).toBeFalse();
  });
  it('`Date.isPast`', () => {
    expect(Date.isPast(past)).toBeTrue();
    expect(Date.isPast(future)).toBeFalse();
  });
  it('`isFuture`', () => {
    expect(future.isFuture()).toBeTrue();
    expect(past.isFuture()).toBeFalse();
  });
  it('`Date.isFuture`', () => {
    expect(Date.isFuture(future)).toBeTrue();
    expect(Date.isFuture(past)).toBeFalse();
  });
  it('`isBefore`', () => {
    expect(now.isBefore('tomorrow')).toBeTrue();
    expect(now.isBefore(new Date(now.valueOf() + 100))).toBeTrue();
    expect(now.isBefore(new Date(now.valueOf() - 100), 100)).toBeFalse();
    expect(now.isBefore(now.valueOf())).toBeFalse();
  });
  it('`Date.isBefore`', () => {
    expect(Date.isBefore('today', 'tomorrow')).toBeTrue();
    expect(Date.isBefore(now)(new Date(now.valueOf() + 100))).toBeTrue();
    expect(Date.isBefore(100, now)(new Date(now.valueOf() - 100))).toBeFalse();
  });
  it('`isAfter`', () => {
    expect(now.isAfter('yesterday')).toBeTrue();
    expect(now.isAfter(new Date(now.valueOf() - 100))).toBeTrue();
    expect(now.isBefore(new Date(now.valueOf() - 100), 100)).toBeFalse();
    expect(now.isAfter(now.valueOf())).toBeFalse();
  });
  it('`Date.isAfter`', () => {
    expect(Date.isAfter('today', 'yesterday')).toBeTrue();
    expect(Date.isAfter(now)(new Date(now.valueOf() - 100))).toBeTrue();
    expect(Date.isAfter(100, now)(new Date(now.valueOf() + 100))).toBeFalse();
  });
  it('`isBetween`', () => {
    expect(now.isBetween(past, future)).toBeTrue();
    expect(now.isBetween(new Date(now.valueOf() + 100), new Date(now.valueOf() - 100), 100)).toBeTrue();
    expect(now.isBetween(new Date(now.valueOf() + 100), new Date(now.valueOf() - 100))).toBeFalse();
  });
  it('`Date.isBetween`', () => {
    expect(Date.isBetween(now, past, future)).toBeTrue();
    expect(Date.isBetween(100)(now, new Date(now.valueOf() + 100), new Date(now.valueOf() - 100))).toBeTrue();
    expect(Date.isBetween(new Date(now.valueOf() + 100), new Date(now.valueOf() - 100))(now)).toBeFalse();
  });
});