"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _range = _interopRequireDefault(require("../../core/range"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/range', () => {
  it('number range', () => {
    expect(new _range.default(0, 3).toArray()).toEqual([0, 1, 2, 3]);
  });
  it('number range without including of bounds', () => {
    expect(new _range.default([0], [3]).toArray()).toEqual([1, 2]);
  });
  it('reversed number range', () => {
    expect(new _range.default(3, 0).toArray()).toEqual([3, 2, 1, 0]);
  });
  it('reversed number range without including of bounds', () => {
    expect(new _range.default([3], [0]).toArray()).toEqual([2, 1]);
  });
  it('string range', () => {
    expect(new _range.default('a', 'e').toArray()).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(new _range.default('a', 'e'.codePointAt(0) - 2).toArray()).toEqual(['a', 'b', 'c']);
    expect(new _range.default('a'.codePointAt(0) + 2, 'e').toArray()).toEqual(['c', 'd', 'e']);
  });
  it('string range without including of bounds', () => {
    expect(new _range.default(['a'], ['e']).toArray()).toEqual(['b', 'c', 'd']);
  });
  it('string range (extended Unicode)', () => {
    expect(new _range.default('😁', '😅').toArray()).toEqual(['😁', '😂', '😃', '😄', '😅']);
    expect(new _range.default('😁', '😅'.codePointAt(0) - 2).toArray()).toEqual(['😁', '😂', '😃']);
  });
  it('string range (extended Unicode) without including of bounds', () => {
    expect(new _range.default(['😁'], ['😅']).toArray()).toEqual(['😂', '😃', '😄']);
  });
  it('reversed string range', () => {
    expect(new _range.default('e', 'a').toArray()).toEqual(['e', 'd', 'c', 'b', 'a']);
  });
  it('reversed string range without including of bounds', () => {
    expect(new _range.default(['e'], ['a']).toArray()).toEqual(['d', 'c', 'b']);
  });
  it('date range', () => {
    expect(new _range.default(Date.create('today'), Date.create('tomorrow')).toArray(12 .hours())).toEqual([Date.create('today'), Date.create('today').set({
      hours: 12
    }), Date.create('tomorrow')]);
  });
  it('date range without including of bounds', () => {
    expect(new _range.default([Date.create('today')], [Date.create('tomorrow')]).toArray(12 .hours())).toEqual([Date.create('today').set({
      milliseconds: 1
    }), Date.create('today').set({
      milliseconds: 1,
      hours: 12
    })]);
  });
  it('reversed date range', () => {
    expect(new _range.default(Date.create('tomorrow'), Date.create('today')).toArray(12 .hours())).toEqual([Date.create('tomorrow'), Date.create('today').set({
      hours: 12
    }), Date.create('today')]);
  });
  it('reversed date range without including of bounds', () => {
    expect(new _range.default([Date.create('tomorrow')], [Date.create('today')]).toArray(12 .hours())).toEqual([Date.create('today').endOfDay(), Date.create('today').add({
      milliseconds: -1,
      hours: 12
    })]);
  });
  it('`span`', () => {
    expect(new _range.default(0, 3).span()).toBe(4);
    expect(new _range.default(0).span()).toBe(Infinity);
    expect(new _range.default(3, 0).span()).toBe(4);
    expect(new _range.default('a', 'd').span()).toBe(4);
    expect(new _range.default(new Date(), new Date().add({
      milliseconds: 3
    })).span()).toBeGreaterThanOrEqual(4);
  });
  it('infinity ranges', () => {
    expect(new _range.default().span()).toBe(Number.POSITIVE_INFINITY);
    expect(new _range.default().toString()).toBe('..');
    expect(new _range.default().contains(-10)).toBe(true);
    expect(() => new _range.default().toArray()).toThrowError("Can't create an array of the infinitive range. Use an iterator instead.");
    expect(new _range.default(0).span()).toBe(Number.POSITIVE_INFINITY);
    expect(new _range.default(0).toString()).toBe('0..');
    expect(new _range.default(0).contains(-10)).toBe(false);
    expect(new _range.default(0).contains(10)).toBe(true);
    expect(new _range.default(0).contains(0)).toBe(true);
    expect(new _range.default([0]).contains(0)).toBe(false);
    expect(new _range.default(null, 0).span()).toBe(Number.POSITIVE_INFINITY);
    expect(new _range.default(-Infinity, 0).toString()).toBe('..0');
    expect(new _range.default(null, 0).contains(-10)).toBe(true);
    expect(new _range.default(null, 0).contains(10)).toBe(false);
    expect(new _range.default(null, 0).contains(0)).toBe(true);
    expect(new _range.default(null, [0]).contains(0)).toBe(false);
    expect(new _range.default(new Date()).span()).toBe(Number.POSITIVE_INFINITY);
    expect(new _range.default('a').span()).toBe(Number.POSITIVE_INFINITY);
    expect(new _range.default('a').toString()).toBe('a..');
    expect(new _range.default('a').contains('0')).toBe(false);
    expect(new _range.default('a').contains('c')).toBe(true);
    expect(new _range.default('a').contains('a')).toBe(true);
    expect(new _range.default(['a']).contains('a')).toBe(false);
    expect(new _range.default(null, 'a').span()).toBe(Number.POSITIVE_INFINITY);
    expect(new _range.default(-Infinity, 'a').toString()).toBe('..a');
    expect(new _range.default(null, 'a').contains('0')).toBe(true);
    expect(new _range.default(null, 'a').contains('c')).toBe(false);
    expect(new _range.default(null, 'a').contains('a')).toBe(true);
    expect(new _range.default(null, ['a']).contains('a')).toBe(false);
  });
  it('`clamp`', () => {
    expect(new _range.default(0, 3).clamp(2)).toBe(2);
    expect(new _range.default(0, 3).clamp(20)).toBe(3);
    expect(new _range.default(0, 3).clamp(-20)).toBe(0);
    expect(new _range.default(0).clamp(20)).toBe(20);
    expect(new _range.default(null, 3).clamp(-20)).toBe(-20);
    expect(new _range.default(0).clamp(20)).toBe(20);
    expect(new _range.default(40, 10).clamp(20)).toBe(20);
    expect(new _range.default(40, 10).clamp(0)).toBe(10);
  });
  it('checking of containment', () => {
    expect(new _range.default(0, 3).contains(1)).toBe(true);
    expect(new _range.default(0, 3).contains(10)).toBe(false);
    expect(new _range.default(0).contains(10)).toBe(true);
    expect(new _range.default(1, 10).contains(new _range.default(4, 6))).toBe(true);
    expect(new _range.default(1, 10).contains(new _range.default(4, 12))).toBe(false);
    expect(new _range.default(1).contains(new _range.default(4, 6))).toBe(true);
    expect(new _range.default(1, 10).contains(new _range.default(4))).toBe(false);
    expect(new _range.default(1, 10).contains(new _range.default('a', 'z'))).toBe(false);
    expect(new _range.default('a', 'd').contains('b')).toBe(true);
    expect(new _range.default('a', 'd').contains('z')).toBe(false);
  });
  it('`intersection`', () => {
    expect(new _range.default(0, 3).intersect(new _range.default(2, 10)).toArray()).toEqual([2, 3]);
    expect(new _range.default(5, -2).intersect(new _range.default(2, 10)).toArray()).toEqual([5, 4, 3, 2]);
    expect(new _range.default(-2, 5).intersect(new _range.default(10, 2)).toArray()).toEqual([2, 3, 4, 5]);
    expect(new _range.default(-1, 1).intersect(new _range.default(1, 2)).toArray()).toEqual([1]);
    expect(new _range.default(-1, 1).intersect(new _range.default([1], 2)).toArray()).toEqual([]);
    expect(new _range.default(1).intersect(new _range.default([1], 3)).toArray()).toEqual([2, 3]);
    expect(new _range.default(1, 10000).intersect(new _range.default('a', 'z')).toArray()).toEqual([]);
  });
  it('`union`', () => {
    expect(new _range.default(0, 3).union(new _range.default(2, 4)).toArray()).toEqual([0, 1, 2, 3, 4]);
    expect(new _range.default(5, -2).union(new _range.default(2, 3)).toArray()).toEqual([5, 4, 3, 2, 1, 0, -1, -2]);
    expect(new _range.default(-2, 5).union(new _range.default(3, 2)).toArray()).toEqual([-2, -1, 0, 1, 2, 3, 4, 5]);
    expect(new _range.default([-2], [5]).union(new _range.default(3, 2)).toArray()).toEqual([-1, 0, 1, 2, 3, 4]);
    expect(new _range.default(2).union(new _range.default(3, 2)).toString()).toBe('2..');
    expect(new _range.default(1, 10000).union(new _range.default('a', 'z')).toArray()).toEqual([]);
  });
  it('`clone`', () => {
    const r = new _range.default(0, 1);
    expect(r.clone()).not.toBe(r);
    expect(r.clone().toArray()).toEqual(r.toArray());
    expect(new _range.default(0, [0]).clone().toArray()).toEqual([]);
  });
  it('`reverse`', () => {
    const r = new _range.default(0, [3]);
    expect(r.reverse()).not.toBe(r);
    expect(r.reverse().toArray()).toEqual(r.toArray().reverse());
    expect(new _range.default(0, [0]).reverse().toArray()).toEqual([]);
  });
  it('`isValid`', () => {
    expect(new _range.default(0, 2).isValid()).toBe(true);
    expect(new _range.default(0, '2').isValid()).toBe(true);
    expect(new _range.default(0, 'a').isValid()).toBe(true);
    expect(new _range.default(new Date(), new Date('foo')).isValid()).toBe(false);
  });
  it('`toString`', () => {
    expect(new _range.default(0, 10).toString()).toBe('0..10');
    expect(new _range.default(10, 0).toString()).toBe('10..0');
    expect(new _range.default(0, 0).toString()).toBe('0..0');
    expect(new _range.default(0, [0]).toString()).toBe('');
    expect(new _range.default([0], 0).toString()).toBe('');
    expect(new _range.default('a', 'd').toString()).toBe('a..d');
    expect(new _range.default(['a'], 'd').toString()).toBe('b..d');
    expect(new _range.default('a').toString()).toBe('a..');
    expect(new _range.default(null, 'a').toString()).toBe('..a');
  });
  it('`toArray`', () => {
    expect(new _range.default(0, 2).toArray()).toEqual([0, 1, 2]);
    expect(new _range.default(2, 0).toArray()).toEqual([2, 1, 0]);
    expect(new _range.default('a', 'd').toArray()).toEqual(['a', 'b', 'c', 'd']);
    expect(new _range.default('d', 'a').toArray()).toEqual(['d', 'c', 'b', 'a']);
  });
  it('default iterator', () => {
    const r = new _range.default(0, 2);
    expect(r[Symbol.iterator]().next()).toEqual({
      value: 0,
      done: false
    });
    expect([...r]).toEqual([0, 1, 2]);
  });
  it('`values`', () => {
    const r = new _range.default(0, 4);
    expect([...r.values()]).toEqual([0, 1, 2, 3, 4]);
    expect([...r.values(2)]).toEqual([0, 2, 4]);
    expect([...r.values(3)]).toEqual([0, 3]);
  });
  it('`entries`', () => {
    const r = new _range.default([4], 0);
    expect([...r.entries()]).toEqual([[0, 3], [1, 2], [2, 1], [3, 0]]);
    expect([...r.entries(2)]).toEqual([[0, 3], [1, 1]]);
    expect([...r.entries(3)]).toEqual([[0, 3], [1, 0]]);
  });
  it('`indices`', () => {
    const r = new _range.default([4], [0]);
    expect([...r.indices()]).toEqual([0, 1, 2]);
    expect([...r.indices(2)]).toEqual([0, 1]);
    expect([...r.indices(3)]).toEqual([0]);
  });
});