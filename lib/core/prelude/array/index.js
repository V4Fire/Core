"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
var _const = require("../../../core/prelude/array/const");
(0, _extend.default)(Array.prototype, 'union', function union(...args) {
  const that = this;
  function* makeIterator() {
    yield* that.values();
    for (let i = 0; i < args.length; i++) {
      const val = args[i];
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
      return arr.concat(args[0] != null ? args[0] : _const.emptyArray);
    case 2:
      return arr.concat(args[0] != null ? args[0] : _const.emptyArray, args[1] != null ? args[1] : _const.emptyArray);
    case 3:
      return arr.concat(args[0] != null ? args[0] : _const.emptyArray, args[1] != null ? args[1] : _const.emptyArray, args[2] != null ? args[2] : _const.emptyArray);
    case 4:
      return arr.concat(args[0] != null ? args[0] : _const.emptyArray, args[1] != null ? args[1] : _const.emptyArray, args[2] != null ? args[2] : _const.emptyArray, args[3] != null ? args[3] : _const.emptyArray);
    default:
      {
        const filteredArgs = [];
        for (let i = 0; i < args.length; i++) {
          const el = args[i];
          if (el != null) {
            filteredArgs.push(el);
          }
        }
        return arr.concat(...filteredArgs);
      }
  }
});