"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.intoIter = intoIter;
var _range = _interopRequireDefault(require("../../core/range"));
function intoIter(obj) {
  if (obj == null) {
    return [].values();
  }
  if (obj === true) {
    return new _range.default(0, Infinity).values();
  }
  if (obj === false) {
    return new _range.default(0, -Infinity).values();
  }
  if (Object.isNumber(obj)) {
    return new _range.default(0, [obj]).values();
  }
  if (Object.isString(obj)) {
    return obj.letters();
  }
  if (Object.isGenerator(obj) || Object.isAsyncGenerator(obj)) {
    return intoIter(Object.cast(obj()));
  }
  if (Object.isArrayLike(obj)) {
    let cursor = 0;
    const objLength = obj.length;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        const done = cursor === objLength;
        const res = {
          value: cursor < objLength ? obj[cursor] : undefined,
          done
        };
        if (!done) {
          cursor++;
        }
        return res;
      }
    };
  }
  if (typeof obj === 'object') {
    const isSyncIter = Object.isIterable(obj);
    if (isSyncIter || Object.isAsyncIterable(obj)) {
      const key = isSyncIter ? Symbol.iterator : Symbol.asyncIterator,
        iter = obj[key]();
      if ('return' in obj || 'throw' in obj) {
        return Object.cast({
          [key]() {
            return this;
          },
          next: iter.next.bind(iter)
        });
      }
      return iter;
    }
    return Object.values(obj).values();
  }
  return [obj].values();
}