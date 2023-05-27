"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _simple = _interopRequireDefault(require("../../../core/cache/simple"));
describe('core/cache/simple', () => {
  it('crud', () => {
    const cache = new _simple.default();
    expect(cache.has('foo')).toBe(false);
    expect(cache.set('foo', 1)).toBe(1);
    expect(cache.get('foo')).toBe(1);
    expect(cache.has('foo')).toBe(true);
    expect(cache.size).toBe(1);
    expect(cache.remove('foo')).toBe(1);
    expect(cache.has('foo')).toBe(false);
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
    expect(cache.has('foo')).toBe(true);
    expect(cache.has('bar')).toBe(true);
    expect(cache.clear()).toEqual(new Map([['foo', 1], ['bar', 2]]));
  });
  it('`clear` with a filter', () => {
    const cache = new _simple.default();
    cache.set('foo', 1);
    cache.set('bar', 2);
    expect(cache.has('foo')).toBe(true);
    expect(cache.has('bar')).toBe(true);
    expect(cache.clear(el => el > 1)).toEqual(new Map([['bar', 2]]));
  });
});