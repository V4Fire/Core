"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormData = exports.Blob = void 0;

var _env = require("../../../core/prelude/env");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
const FormData = (() => {
  if (_env.IS_NODE) {
    const // eslint-disable-next-line @typescript-eslint/no-var-requires
    FormData = require('form-data');

    FormData.prototype.toString = function toString() {
      return this.getBuffer().toString();
    };

    return FormData;
  }

  return globalThis.FormData;
})();

exports.FormData = FormData;

const Blob = (() => {
  if (_env.IS_NODE) {
    return require('node-blob');
  }

  return globalThis.Blob;
})();

exports.Blob = Blob;