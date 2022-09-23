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
    expect(now.is(now.valueOf())).toBe(true);
    expect(now.is(new Date(now.valueOf() - 100), 100)).toBe(true);
    expect(now.is('tomorrow')).toBe(false);
  });
  it('`Date.is`', () => {
    expect(Date.is(100, now)(new Date(now.valueOf() - 100))).toBe(true);
    expect(Date.is(now)(now.valueOf())).toBe(true);
    expect(Date.is('today', 'tomorrow')).toBe(false);
  });
  it('`isPast`', () => {
    expect(past.isPast()).toBe(true);
    expect(future.isPast()).toBe(false);
  });
  it('`Date.isPast`', () => {
    expect(Date.isPast(past)).toBe(true);
    expect(Date.isPast(future)).toBe(false);
  });
  it('`isFuture`', () => {
    expect(future.isFuture()).toBe(true);
    expect(past.isFuture()).toBe(false);
  });
  it('`Date.isFuture`', () => {
    expect(Date.isFuture(future)).toBe(true);
    expect(Date.isFuture(past)).toBe(false);
  });
  it('`isBefore`', () => {
    expect(now.isBefore('tomorrow')).toBe(true);
    expect(now.isBefore(new Date(now.valueOf() + 100))).toBe(true);
    expect(now.isBefore(new Date(now.valueOf() - 100), 100)).toBe(false);
    expect(now.isBefore(now.valueOf())).toBe(false);
  });
  it('`Date.isBefore`', () => {
    expect(Date.isBefore('today', 'tomorrow')).toBe(true);
    expect(Date.isBefore(now)(new Date(now.valueOf() + 100))).toBe(true);
    expect(Date.isBefore(100, now)(new Date(now.valueOf() - 100))).toBe(false);
  });
  it('`isAfter`', () => {
    expect(now.isAfter('yesterday')).toBe(true);
    expect(now.isAfter(new Date(now.valueOf() - 100))).toBe(true);
    expect(now.isBefore(new Date(now.valueOf() - 100), 100)).toBe(false);
    expect(now.isAfter(now.valueOf())).toBe(false);
  });
  it('`Date.isAfter`', () => {
    expect(Date.isAfter('today', 'yesterday')).toBe(true);
    expect(Date.isAfter(now)(new Date(now.valueOf() - 100))).toBe(true);
    expect(Date.isAfter(100, now)(new Date(now.valueOf() + 100))).toBe(false);
  });
  it('`isBetween`', () => {
    expect(now.isBetween(past, future)).toBe(true);
    expect(now.isBetween(new Date(now.valueOf() + 100), new Date(now.valueOf() - 100), 100)).toBe(true);
    expect(now.isBetween(new Date(now.valueOf() + 100), new Date(now.valueOf() - 100))).toBe(false);
  });
  it('`Date.isBetween`', () => {
    expect(Date.isBetween(now, past, future)).toBe(true);
    expect(Date.isBetween(100)(now, new Date(now.valueOf() + 100), new Date(now.valueOf() - 100))).toBe(true);
    expect(Date.isBetween(new Date(now.valueOf() + 100), new Date(now.valueOf() - 100))(now)).toBe(false);
  });
});
