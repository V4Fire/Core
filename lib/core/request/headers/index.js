"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _interpolation = require("../../../core/request/helpers/interpolation");
var _const = require("../../../core/request/headers/const");
var _interface = require("../../../core/request/headers/interface");
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
class V4Headers {
  constructor(headers, query) {
    Object.defineProperty(this, _const.requestQuery, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: query
    });
    if (Object.isString(headers)) {
      let lastHeaderName = '';
      for (let o = headers.split(/[\r\n]+/), i = 0; i < o.length; i++) {
        const header = o[i].trim();
        if (header === '') {
          continue;
        }
        const headerChunks = header.split(':', 2);
        if (headerChunks.length === 2) {
          lastHeaderName = headerChunks[0];
          headerChunks.shift();
        }
        const value = headerChunks[0];
        if (value != null) {
          this.append(lastHeaderName, value.split(','));
        }
      }
    } else if (headers != null) {
      const isIterable = Object.isFunction(headers.entries);
      let iter;
      if (headers instanceof V4Headers || isIterable) {
        iter = Object.cast(headers).entries();
      } else {
        iter = Object.entries(headers).values();
      }
      const isNativeHeaders = !(headers instanceof V4Headers) && isIterable;
      for (const [name, value] of iter) {
        if (value == null) {
          continue;
        }
        if (isNativeHeaders) {
          this.append(name, value);
        } else {
          this.set(name, value);
        }
      }
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get(name) {
    return this[this.normalizeHeaderName(name)] ?? null;
  }
  has(name) {
    return this.normalizeHeaderName(name) in this;
  }
  set(name, value) {
    const normalizedName = this.normalizeHeaderName(name);
    if (normalizedName === '') {
      return;
    }
    if (Object.isArray(value)) {
      this.delete(name);
      value.forEach(val => this.append(name, val));
      return;
    }
    Object.defineProperty(this, normalizedName, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: this.normalizeHeaderValue(value)
    });
  }
  append(name, value) {
    const normalizedName = this.normalizeHeaderName(name),
      normalizedVal = this.normalizeHeaderValue(value);
    if (normalizedName === '' || normalizedVal === '') {
      return;
    }
    if (Object.isArray(value)) {
      value.forEach(val => this.append(name, val));
      return;
    }
    const currentVal = this[normalizedName],
      newVal = currentVal != null ? `${currentVal}, ${this.normalizeHeaderValue(value)}` : value;
    this.set(name, newVal);
  }
  delete(name) {
    delete this[name];
    delete this[this.normalizeHeaderName(name)];
  }
  forEach(cb, thisArg) {
    for (const [key, value] of this.entries()) {
      cb.call(thisArg, value, key, this);
    }
  }
  values() {
    return Object.values(this).values();
  }
  keys() {
    return Object.keys(this).values();
  }
  entries() {
    return Object.entries(this).values();
  }
  normalizeHeaderName(name) {
    return (0, _interpolation.applyQueryForStr)(String(name).trim(), this[_const.requestQuery]).toLowerCase();
  }
  normalizeHeaderValue(value) {
    return (0, _interpolation.applyQueryForStr)(String(value != null ? value : '').trim(), this[_const.requestQuery]);
  }
}
exports.default = V4Headers;