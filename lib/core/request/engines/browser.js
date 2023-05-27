"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fetch = _interopRequireDefault(require("../../../core/request/engines/fetch"));
var _xhr = _interopRequireDefault(require("../../../core/request/engines/xhr"));
var _default = typeof AbortController !== 'undefined' ? _fetch.default : _xhr.default;
exports.default = _default;