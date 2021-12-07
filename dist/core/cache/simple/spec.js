"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _simple = _interopRequireDefault(require("../../../core/cache/simple"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/cache/simple', () => {
  it('crud', () => {
    const cache = new _simple.default();
    expect(cache.has('foo')).toBeFalse();
    expect(cache.set('foo', 1)).toBe(1);
    expect(cache.get('foo')).toBe(1);
    expect(cache.has('foo')).toBeTrue();
    expect(cache.size).toBe(1);
    expect(cache.remove('foo')).toBe(1);
    expect(cache.has('foo')).toBeFalse();
  });
  it('default iterator', () => {
    const cache = new _simple.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect(cache[Symbol.iterator]().next()).toEqual({
      value: '1',
      done: false
    });
    expect([...cache]).toEqual(['1', '2']);
  });
  it('`keys`', () => {
    const cache = new _simple.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect([...cache.keys()]).toEqual(['1', '2']);
  });
  it('`values`', () => {
    const cache = new _simple.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect([...cache.values()]).toEqual([1, 2]);
  });
  it('`entries`', () => {
    const cache = new _simple.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect([...cache.entries()]).toEqual([['1', 1], ['2', 2]]);
  });
  it('`clear`', () => {
    const cache = new _simple.default();
    cache.set('foo', 1);
    cache.set('bar', 2);
    expect(cache.has('foo')).toBeTrue();
    expect(cache.has('bar')).toBeTrue();
    expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
  });
  it('`clear` with a filter', () => {
    const cache = new _simple.default();
    cache.set('foo', 1);
    cache.set('bar', 2);
    expect(cache.has('foo')).toBeTrue();
    expect(cache.has('bar')).toBeTrue();
    expect(cache.clear(el => el > 1)).toEqual(new Map([['bar', 2]]));
  });
});