"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsyncOptions = isAsyncOptions;
function isAsyncOptions(value) {
  return Object.isDictionary(value);
}