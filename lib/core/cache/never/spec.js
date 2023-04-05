"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _never = _interopRequireDefault(require("../../../core/cache/never"));
describe('core/cache/never', () => {
  it('crud', () => {
    const cache = new _never.default();
    expect(cache.has('foo')).toBe(false);
    expect(cache.set('foo', 1)).toBe(1);
    expect(cache.get('foo')).toBeUndefined();
    expect(cache.has('foo')).toBe(false);
    expect(cache.size).toBe(0);
    expect(cache.remove('foo')).toBeUndefined();
    expect(cache.has('foo')).toBe(false);
  });
  it('default iterator', () => {
    const cache = new _never.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect(cache[Symbol.iterator]().next()).toEqual({
      value: undefined,
      done: true
    });
    expect([...cache]).toEqual([]);
  });
  it('`keys`', () => {
    const cache = new _never.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect([...cache.keys()]).toEqual([]);
  });
  it('`values`', () => {
    const cache = new _never.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect([...cache.values()]).toEqual([]);
  });
  it('`entries`', () => {
    const cache = new _never.default();
    cache.set('1', 1);
    cache.set('2', 2);
    expect([...cache.entries()]).toEqual([]);
  });
  it('`clear`', () => {
    const cache = new _never.default();
    cache.set('foo', 1);
    cache.set('bar', 2);
    expect(cache.clear()).toEqual(new Map([]));
  });
  it('`clear` with a filter', () => {
    const cache = new _never.default();
    cache.set('foo', 1);
    cache.set('bar', 2);
    expect(cache.clear(el => el > 1)).toEqual(new Map([]));
  });
});