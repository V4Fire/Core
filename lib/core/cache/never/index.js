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

/* eslint-disable @typescript-eslint/no-unused-vars-experimental */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/never/README.md]]
 * @packageDocumentation
 */

/**
 * Loopback class for a cache data structure
 */
class NeverCache {
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
    return false;
  }
  /** @see [[Cache.get]] */


  get(key) {
    return undefined;
  }
  /** @see [[Cache.set]] */


  set(key, value) {
    return value;
  }
  /** @see [[Cache.remove]] */


  remove(key) {
    return undefined;
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
    return new Map();
  }

}

exports.default = NeverCache;