"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Result = exports.Option = void 0;

var _syncPromise = _interopRequireDefault(require("../../../core/prelude/structures/sync-promise"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class Option extends _syncPromise.default {
  type = 'Maybe';
}

exports.Option = Option;

class Result extends _syncPromise.default {
  type = 'Either';
}

exports.Result = Result;