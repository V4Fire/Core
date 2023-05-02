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
class NeverCache {
  get size() {
    return this.storage.size;
  }
  storage = new Map();
  [Symbol.iterator]() {
    return this.keys();
  }
  has(key) {
    return false;
  }
  get(key) {
    return undefined;
  }
  set(key, value) {
    return value;
  }
  remove(key) {
    return undefined;
  }
  keys() {
    return this.storage.keys();
  }
  values() {
    return this.storage.values();
  }
  entries() {
    return this.storage.entries();
  }
  clear(filter) {
    return new Map();
  }
}
exports.default = NeverCache;