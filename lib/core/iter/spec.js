"use strict";

var _iter = require("../../core/iter");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/iter', () => {
  describe('intoIter', () => {
    it('passing `true` as a value', () => {
      const iter = (0, _iter.intoIter)(true),
            res = [];
      let i = 0;

      for (const val of iter) {
        res.push(val);
        i++;

        if (i === 10) {
          break;
        }
      }

      expect(res).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    it('passing `false` as a value', () => {
      const iter = (0, _iter.intoIter)(false),
            res = [];
      let i = 0;

      for (const val of iter) {
        res.push(val);
        i++;

        if (i === 10) {
          break;
        }
      }

      expect(res).toEqual([0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
    });
    it('passing `null` as a value', () => {
      expect([...(0, _iter.intoIter)(null)]).toEqual([]);
    });
    it('passing `undefined` as a value', () => {
      expect([...(0, _iter.intoIter)(undefined)]).toEqual([]);
    });
    it('passing a positive number as a value', () => {
      expect([...(0, _iter.intoIter)(3)]).toEqual([0, 1, 2]);
    });
    it('passing a negative number as a value', () => {
      expect([...(0, _iter.intoIter)(-3)]).toEqual([0, -1, -2]);
    });
    it('passing a string as a value', () => {
      expect([...(0, _iter.intoIter)('1😃à🇷🇺👩🏽‍❤️‍💋‍👨')]).toEqual(['1', '😃', 'à', '🇷🇺', '👩🏽‍❤️‍💋‍👨']);
    });
    it('passing a dictionary as a value', () => {
      expect([...(0, _iter.intoIter)({
        a: 1,
        b: 2
      })]).toEqual([1, 2]);
    });
    it('passing a generator as a value', () => {
      function* gen() {
        yield* [1, 2];
      }

      const iter = (0, _iter.intoIter)(gen);
      expect([...iter]).toEqual([1, 2]);
      expect(iter.return).toBeUndefined();
      expect(iter.throw).toBeUndefined();
    });
    it('passing an async generator as a value', async () => {
      async function* gen() {
        yield* [1, 2];
      }

      const iter = (0, _iter.intoIter)(gen),
            res = [];

      for await (const val of (0, _iter.intoIter)(gen)) {
        res.push(val);
      }

      expect(res).toEqual([1, 2]);
      expect(iter.return).toBeUndefined();
      expect(iter.throw).toBeUndefined();
    });
    it('passing an iterable as a value', () => {
      function* gen() {
        yield* [1, 2];
      }

      const iter = (0, _iter.intoIter)(gen());
      expect([...iter]).toEqual([1, 2]);
      expect(iter.return).toBeUndefined();
      expect(iter.throw).toBeUndefined();
    });
    it('passing an async iterable as a value', async () => {
      async function* gen() {
        yield* [1, 2];
      }

      const iter = (0, _iter.intoIter)(gen()),
            res = [];

      for await (const val of (0, _iter.intoIter)(gen)) {
        res.push(val);
      }

      expect(res).toEqual([1, 2]);
      expect(iter.return).toBeUndefined();
      expect(iter.throw).toBeUndefined();
    });
    it('passing an array-like object', () => {
      const arrayLike = Object.create(null);
      arrayLike.length = 3;
      arrayLike[0] = '0';
      arrayLike[1] = '1';
      arrayLike[2] = '2';
      expect([...(0, _iter.intoIter)(arrayLike)]).toEqual([0, 1, 2]);
    });
  });
});