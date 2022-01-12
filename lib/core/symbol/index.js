"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generator;

var _const = require("../../core/prelude/types/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/symbol/README.md]]
 * @packageDocumentation
 */

/**
 * Returns a factory for flexible creation of unique symbols by the first touch
 * @param fields - list of predefined fields (it can be useful to shim the Proxy API)
 */
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