"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seq = seq;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/iter/combinators/README.md]]
 * @packageDocumentation
 */

/**
 * Takes iterable objects and returns a new iterator that produces values from them sequentially
 *
 * @param iterable
 * @param iterables
 */

/**
 * Takes asynchronous iterable objects and returns a new asynchronous iterator
 * that produces values from them sequentially
 *
 * @param iterable
 * @param iterables
 */
function seq(...iterables) {
  let cursor = 0,
      iter;
  const isAsync = Object.isAsyncIterable(iterables[cursor]);

  if (isAsync) {
    return {
      [Symbol.asyncIterator]() {
        return this;
      },

      async next() {
        if (cursor >= iterables.length) {
          return Promise.resolve({
            value: undefined,
            done: true
          });
        }

        if (!Object.isTruly(iter)) {
          iter = getIter(iterables[cursor]);
        }

        let res;

        while ((res = await iter.next(), res.done) && ++cursor < iterables.length) {
          // eslint-disable-next-line require-atomic-updates
          iter = getIter(iterables[cursor]);
        }

        return res;

        function getIter(obj) {
          let i;

          if (Object.isAsyncIterable(obj)) {
            i = obj[Symbol.asyncIterator]();
          } else {
            i = obj[Symbol.iterator]();
          }

          return Object.cast(i);
        }
      }

    };
  }

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      if (cursor >= iterables.length) {
        return {
          value: undefined,
          done: true
        };
      }

      if (!Object.isTruly(iter)) {
        iter = iterables[cursor][Symbol.iterator]();
      }

      let res;

      while ((res = iter.next(), res.done) && ++cursor < iterables.length) {
        iter = iterables[cursor][Symbol.iterator]();
      }

      return res;
    }

  };
}