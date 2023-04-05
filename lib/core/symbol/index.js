"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generator;
var _const = require("../../core/prelude/types/const");
function generator(fields) {
  const obj = Object.createDict();
  if (typeof Proxy !== 'function') {
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        const el = fields[i];
        obj[el] = Symbol(el);
      }
    }
    return obj;
  }
  return new Proxy(obj, {
    get: (target, key) => {
      if (key === _const.PROXY) {
        return target;
      }
      if (key in target) {
        return target[key];
      }
      return target[key] = typeof key === 'symbol' ? key : Symbol(key);
    },
    set: () => false,
    defineProperty: () => false,
    deleteProperty: () => false,
    has: (target, key) => {
      if (key === _const.READONLY || key === _const.PROXY) {
        return true;
      }
      return Reflect.has(target, key);
    }
  });
}