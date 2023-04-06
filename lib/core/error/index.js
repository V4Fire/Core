"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _interface = require("../../core/error/interface");
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
class BaseError extends Error {
  constructor(message, cause) {
    super(message);
    Object.defineProperties(this, {
      name: {
        value: new.target.name
      },
      internalMessage: {
        value: message
      },
      cause: {
        value: cause
      },
      message: {
        get() {
          return this.format();
        },
        set(newValue) {
          this.internalMessage = newValue;
        }
      }
    });
    if (Object.getPrototypeOf(this) === Error.prototype) {
      Object.setPrototypeOf(this, new.target.prototype);
      if ('captureStackTrace' in Error) {
        Error.captureStackTrace(this, new.target);
      }
    }
  }
  format() {
    return this.internalMessage ?? '';
  }
}
exports.default = BaseError;