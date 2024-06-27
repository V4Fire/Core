"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statusesContainStatus = statusesContainStatus;
var _range = _interopRequireDefault(require("../../../core/range"));
function statusesContainStatus(statuses, statusCode) {
  if (statuses instanceof _range.default) {
    return statuses.contains(statusCode);
  }
  if (Object.isArray(statuses)) {
    return statuses.includes(statusCode);
  }
  return statuses === statusCode;
}