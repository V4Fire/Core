"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = void 0;

var _env = require("../../../core/env");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
// eslint-disable-next-line import/no-mutable-exports
let serialize;
exports.serialize = serialize;

if (_env.IS_NODE) {
  ({
    serialize
  } = require('../../../core/xml/engines/node'));
  exports.serialize = serialize;
} else {
  ({
    serialize
  } = require('../../../core/xml/engines/browser'));
  exports.serialize = serialize;
}