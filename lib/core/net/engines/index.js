"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOnline = void 0;
var _env = require("../../../core/env");
let isOnline;
exports.isOnline = isOnline;
if (_env.IS_NODE) {
  ({
    isOnline
  } = require('../../../core/net/engines/node-request'));
  exports.isOnline = isOnline;
} else {
  ({
    isOnline
  } = require('../../../core/net/engines/browser-request'));
  exports.isOnline = isOnline;
}