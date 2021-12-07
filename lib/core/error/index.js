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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/error/README.md]]
 * @packageDocumentation
 */

/**
 * Superclass of any error to inherit
 */
class BaseError extends Error {
  /**
   * An error that causes the current error
   */

  /**
   * Internal storage for an error message
   */
  constructor(message, cause) {
    super(message); // All following fields are not enumerable

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
    }); // Change a prototype of 'this' only if it's corrupted

    if (Object.getPrototypeOf(this) === Error.prototype) {
      Object.setPrototypeOf(this, new.target.prototype); // Left all unnecessary frames from the stack trace
      // @see https://v8.dev/docs/stack-trace-api#stack-trace-collection-for-custom-exceptions

      if ('captureStackTrace' in Error) {
        Error.captureStackTrace(this, new.target);
      }
    }
  }
  /**
   * Formats internal error's data to produce a message.
   * The method calls when accessing the `message` property.
   */


  format() {
    return this.internalMessage ?? '';
  }

}

exports.default = BaseError;