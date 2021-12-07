"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

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

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/error/README.md]]
 * @packageDocumentation
 */

/**
 * Class to wrap any request error
 */
class RequestError extends _error.default {
  /**
   * Default error type: a server has responded with a non-ok status
   */
  static InvalidStatus = 'invalidStatus';
  /**
   * Default error type: a request was aborted
   */

  static Abort = 'abort';
  /**
   * Default error type: a request was aborted because of a timeout
   */

  static Timeout = 'timeout';
  /**
   * Default error type: a request was failed because there is no connection to a network
   */

  static Offline = 'offline';
  /**
   * Default error type: a request was failed because of an internal request engine' error
   */

  static Engine = 'engine';
  /**
   * Error type
   */

  /**
   * @param type - error type
   * @param details - error details
   */
  constructor(type, details) {
    super();
    this.type = type;
    this.details = details ?? {};
  }

  format() {
    const d = this.details;
    const parts = [d.request?.method, d.request?.path, d.response?.status];
    const head = `[${this.type}]`,
          body = parts.filter(p => p != null).join(' ');

    if (body.length > 0) {
      return `${head} ${body}`;
    }

    return head;
  }

}

exports.default = RequestError;