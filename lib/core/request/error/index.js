"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _env = require("../../../core/env");
var _error = _interopRequireDefault(require("../../../core/error"));
var _interface = require("../../../core/request/error/interface");
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
var _extractor = require("../../../core/request/error/extractor");
Object.keys(_extractor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _extractor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _extractor[key];
    }
  });
});
class RequestError extends _error.default {
  static InvalidStatus = 'invalidStatus';
  static Abort = 'abort';
  static Timeout = 'timeout';
  static Offline = 'offline';
  static Engine = 'engine';
  constructor(type, details = {}) {
    super();
    this.type = type;
    if (typeof WeakRef === 'function' && _env.IS_NODE) {
      this.details = new WeakRef(details);
    } else {
      this.details = {
        [Symbol.toStringTag]: 'WeakRef',
        deref: () => details
      };
    }
  }
  format() {
    const d = this.details.deref();
    const parts = [d?.request?.method, d?.request?.path, d?.response?.status];
    const head = `[${this.type}]`,
      body = parts.filter(p => p != null).join(' ');
    if (body.length > 0) {
      return `${head} ${body}`;
    }
    return head;
  }
}
exports.default = RequestError;
