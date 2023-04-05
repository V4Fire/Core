"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsyncOptions = isAsyncOptions;
exports.isParams = void 0;
var _functools = require("../../../../core/functools");
function isAsyncOptions(value) {
  return Object.isPlainObject(value);
}
const isParams = (0, _functools.deprecate)({
  renamedTo: 'isAsyncOptions'
}, function isParams(value) {
  return isAsyncOptions(value);
});
exports.isParams = isParams;