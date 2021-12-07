"use strict";

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/number/format', () => {
  it('`pad`', () => {
    expect(1 .pad()).toBe('1');
    expect(1 .pad(2)).toBe('01');
    expect((-1).pad({
      length: 2
    })).toBe('-01');
    expect(10 .pad(3, {
      sign: true
    })).toBe('+010');
    expect(10 .pad({
      length: 3,
      sign: true
    })).toBe('+010');
    expect(2 .pad(4, {
      base: 2
    })).toBe('0010');
  });
  it('`Number.pad`', () => {
    expect(Number.pad(1, 2)).toBe('01');
    expect(Number.pad(-1, {
      length: 2
    })).toBe('-01');
    expect(Number.pad({
      length: 2,
      sign: true
    })(1)).toBe('+01');
  });
  it('`format`', () => {
    expect(34.5656.format(2)).toBe('34.57');
    expect(34.5656.format()).toBe('34.566');
    expect(100.50.format('$', 'en-us')).toBe('$100.50');
    expect(100.50.format('$:EUR;$d:code', 'en-us')).toBe(100.50.toLocaleString('en-us', {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code'
    }));
    expect(100.50.format({
      style: 'currency',
      currency: 'USD'
    }, 'en-us')).toBe(100.50.toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD'
    }));
  });
  it('`Number.format`', () => {
    expect(Number.format(34.5656)).toBe('34.566');
    expect(Number.format('$', 'en-us')(100.50)).toBe('$100.50');
    expect(Number.format({
      style: 'currency',
      currency: 'USD'
    }, 'en-us')(100.50)).toBe(100.50.toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD'
    }));
  });
});