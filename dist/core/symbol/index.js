"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generator;

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
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }

      return target[prop] = typeof prop === 'symbol' ? prop : Symbol(prop);
    }

  });
}