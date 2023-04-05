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
class SimpleCache {
  get size() {
    return this.storage.size;
  }
  storage = new Map();
  [Symbol.iterator]() {
    return this.keys();
  }
  has(key) {
    return this.storage.has(key);
  }
  get(key) {
    return this.storage.get(key);
  }
  set(key, value) {
    this.storage.set(key, value);
    return value;
  }
  remove(key) {
    if (this.has(key)) {
      const val = this.storage.get(key);
      this.storage.delete(key);
      return val;
    }
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