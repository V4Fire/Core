"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertIfDate = convertIfDate;
exports.evalWith = evalWith;
var _const = require("../../core/prelude/date/const");
const minDateLength = '2017-02-03'.length;
function convertIfDate(key, value) {
  if (Object.isString(value) && value.length >= minDateLength && RegExp.test(_const.isDateStr, value)) {
    const date = Date.create(value);
    return isNaN(date.valueOf()) ? value : date;
  }
  return value;
}
function evalWith(ctx) {
  return (key, value) => {
    if (Object.isArray(value)) {
      const [expr, path, ...args] = value;
      if (!Object.isString(expr) || !Object.isString(path)) {
        return value;
      }
      const pathChunks = path.split('.'),
        ref = Object.get(ctx, pathChunks);
      switch (expr) {
        case 'get':
          return ref;
        case 'call':
          {
            if (!Object.isFunction(ref)) {
              throw new TypeError(`The value at the specified ${path} path is not a function`);
            }
            const refCtx = pathChunks.length === 1 ? ctx : Object.get(ctx, pathChunks.slice(0, -1));
            return ref.apply(refCtx, args);
          }
        default:
          return value;
      }
    }
    return value;
  };
}