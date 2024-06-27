"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statusesContainStatus = statusesContainStatus;
var _range = _interopRequireDefault(require("../../../core/range"));
function statusesContainStatus(statuses, statusCode) {
  return statuses instanceof _range.default ? statuses.contains(statusCode) : Array.concat([], statuses).includes(statusCode);
}