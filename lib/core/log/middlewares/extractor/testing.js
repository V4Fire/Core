"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestExtractor = exports.TestDetailedError = exports.TestDetailedBaseError = exports.TestBaseError = void 0;
var _error = _interopRequireDefault(require("../../../../core/error"));
class TestDetailedError extends Error {
  constructor(message, reason) {
    super(message);
    this.reason = reason;
  }
}
exports.TestDetailedError = TestDetailedError;
class TestBaseError extends _error.default {}
exports.TestBaseError = TestBaseError;
class TestDetailedBaseError extends _error.default {
  constructor(message, reason, cause) {
    super(message, cause);
    this.reason = reason;
  }
}
exports.TestDetailedBaseError = TestDetailedBaseError;
class TestExtractor {
  target = TestDetailedBaseError;
  extract(error) {
    return error.reason;
  }
}
exports.TestExtractor = TestExtractor;