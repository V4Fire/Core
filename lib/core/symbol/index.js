"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generator;
var _const = require("../../core/prelude/types/const");
function generator(fields) {
  const dict = Object.createDict();
  if (fields != null) {
    fields.forEach(field => {
      Object.defineProperty(dict, field, {
        value: Symbol(field)
      });
    });
  }
  if (typeof Proxy !== 'function') {
    return dict;
  }
  Object.setPrototypeOf(dict, new Proxy(Object.createDict(), {
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
  }));
  return dict;
}