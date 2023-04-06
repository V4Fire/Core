"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constant = constant;
exports.identity = identity;
function identity(value) {
  return value;
}
function constant(value) {
  return () => value;
}