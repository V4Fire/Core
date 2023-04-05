"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Result = exports.Option = void 0;
var _syncPromise = _interopRequireDefault(require("../../../core/prelude/structures/sync-promise"));
class Option extends _syncPromise.default {
  type = 'Maybe';
}
exports.Option = Option;
class Result extends _syncPromise.default {
  type = 'Either';
}
exports.Result = Result;