"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormData = exports.Blob = void 0;
var _env = require("../../../core/prelude/env");
const FormData = (() => {
  if (_env.IS_NODE) {
    const FormData = require('form-data');
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