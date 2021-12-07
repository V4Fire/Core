"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOnline = void 0;

var _env = require("../../../core/env");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
// eslint-disable-next-line import/no-mutable-exports
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