"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _interface = require("../../../core/cache/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/simple/README.md]]
 * @packageDocumentation
 */

/**
 * Implementation for a simple in-memory cache data structure
 *
 * @typeparam V - value type
 * @typeparam K - key type (`string` by default)
 */
class SimpleCache {
  /** @see [[Cache.size]] */
  get size() {
    return this.storage.size;
  }
  /**
   * Cache object
   */


  storage = new Map();

  [Symbol.iterator]() {
    return this.keys();
  }
  /** @see [[Cache.has]] */


  has(key) {
    return this.storage.has(key);
  }
  /** @see [[Cache.get]] */


  get(key) {
    return this.storage.get(key);
  }
  /** @see [[Cache.set]] */


  set(key, value) {
    this.storage.set(key, value);
    return value;
  }
  /** @see [[Cache.remove]] */


  remove(key) {
    if (this.has(key)) {
      const val = this.storage.get(key);
      this.storage.delete(key);
      return val;
    }
  }
  /** @see [[Cache.keys]] */


  keys() {
    return this.storage.keys();
  }
  /** @see [[Cache.values]] */


  values() {
    return this.storage.values();
  }
  /** @see [[Cache.entries]] */


  entries() {
    return this.storage.entries();
  }
  /** @see [[Cache.clear]] */


  clear(filter) {
    if (filter) {
      const removed = new Map();

      for (let o = this.storage.entries(), i = o.next(); !i.done; i = o.next()) {
        const [key, el] = i.value;

        if (Object.isTruly(filter(el, key))) {
          removed.set(key, el);
          this.storage.delete(key);
        }
      }

      return removed;
    }

    const removed = new Map(this.storage.entries());
    this.storage.clear();
    return removed;
  }

}

exports.default = SimpleCache;