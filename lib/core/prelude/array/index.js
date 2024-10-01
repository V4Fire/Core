"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
(0, _extend.default)(Array.prototype, 'union', function union(...args) {
  const that = this;
  function* makeIterator() {
    yield* that.values();
    for (const val of args) {
      if (val == null) {
        continue;
      }
      if (Object.isIterable(val) && !Object.isPrimitive(val)) {
        yield* Object.cast(val[Symbol.iterator]());
      } else {
        yield val;
      }
    }
  }
  return [...new Set(makeIterator())];
});
(0, _extend.default)(Array, 'union', (arr, ...args) => {
  if (args.length === 0) {
    return (...args) => Array.union(arr, ...args);
  }
  return arr.union(...args);
});
(0, _extend.default)(Array, 'concat', (arr, ...args) => {
  if (args.length === 0) {
    return (...args) => Array.concat(arr, ...args);
  }
  switch (args.length) {
    case 1:
      return arr.concat(args[0] != null ? args[0] : []);
    case 2:
      return arr.concat(args[0] != null ? args[0] : [], args[1] != null ? args[1] : []);
    case 3:
      return arr.concat(args[0] != null ? args[0] : [], args[1] != null ? args[1] : [], args[2] != null ? args[2] : []);
    case 4:
      return arr.concat(args[0] != null ? args[0] : [], args[1] != null ? args[1] : [], args[2] != null ? args[2] : [], args[3] != null ? args[3] : []);
    default:
      {
        const res = [];
        args.forEach(val => {
          if (val != null) {
            if (Array.isArray(val)) {
              res.push(...val);
            } else {
              res.push(val);
            }
          }
        });
        return res;
      }
  }
});
(0, _extend.default)(Array, 'toArray', (...args) => {
  switch (args.length) {
    case 0:
      return [];
    case 1:
      if (args[0] == null) {
        return [];
      }
      return Array.isArray(args[0]) ? args[0] : [args[0]];
    case 2:
      {
        const res = [];
        if (args[0] != null) {
          if (Array.isArray(args[0])) {
            res.push(...args[0]);
          } else {
            res.push(args[0]);
          }
        }
        if (args[1] != null) {
          if (Array.isArray(args[1])) {
            res.push(...args[1]);
          } else {
            res.push(args[1]);
          }
        }
        return res;
      }
    case 3:
      {
        const res = [];
        if (args[0] != null) {
          if (Array.isArray(args[0])) {
            res.push(...args[0]);
          } else {
            res.push(args[0]);
          }
        }
        if (args[1] != null) {
          if (Array.isArray(args[1])) {
            res.push(...args[1]);
          } else {
            res.push(args[1]);
          }
        }
        if (args[2] != null) {
          if (Array.isArray(args[2])) {
            res.push(...args[2]);
          } else {
            res.push(args[2]);
          }
        }
        return res;
      }
    case 4:
      {
        const res = [];
        if (args[0] != null) {
          if (Array.isArray(args[0])) {
            res.push(...args[0]);
          } else {
            res.push(args[0]);
          }
        }
        if (args[1] != null) {
          if (Array.isArray(args[1])) {
            res.push(...args[1]);
          } else {
            res.push(args[1]);
          }
        }
        if (args[2] != null) {
          if (Array.isArray(args[2])) {
            res.push(...args[2]);
          } else {
            res.push(args[2]);
          }
        }
        if (args[3] != null) {
          if (Array.isArray(args[3])) {
            res.push(...args[3]);
          } else {
            res.push(args[3]);
          }
        }
        return res;
      }
    default:
      {
        const res = [];
        args.forEach(val => {
          if (val != null) {
            if (Array.isArray(val)) {
              res.push(...val);
            } else {
              res.push(val);
            }
          }
        });
        return res;
      }
  }
});