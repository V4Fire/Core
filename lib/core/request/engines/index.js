"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _env = require("../../../core/env");

/* eslint-disable @typescript-eslint/no-var-requires */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
// eslint-disable-next-line import/no-mutable-exports
let transport;

if (_env.IS_NODE) {
  transport = require('../../../core/request/engines/node').default;
} else {
  transport = require('../../../core/request/engines/browser').default;
}

var _default = transport;
exports.default = _default;